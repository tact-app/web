import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { GoalData, GoalIconVariants, GoalStatus } from '../../types';
import { SyntheticEvent } from 'react';
import { JSONContent } from '@tiptap/core';
import { v4 as uuidv4 } from 'uuid';
import { DescriptionData } from '../../../../../types/description';
import { ResizableGroupConfig } from "../../../../shared/ResizableGroup/store";
import { TasksListWithCreatorStore } from "../../../../shared/TasksListWithCreator/store";
import { TasksListStore } from "../../../../shared/TasksList/store";
import { TaskData } from "../../../../shared/TasksList/types";
import { EmojiStore } from "../../../../../stores/EmojiStore";
import { ModalsController } from "../../../../../helpers/ModalsController";
import { GoalCreationModalProps, GoalCreationModalsTypes } from "./types";
import { GoalCreationCloseSubmitModal } from "./modals/GoalCreationCloseSubmitModal";
import { DatePickerHelpers } from "../../../../shared/DatePicker/helpers";
import { cloneDeep, isEqual } from "lodash";
import { GoalWontDoSubmitModal } from "../GoalWontDoSubmitModal";
import { EMOJI_SELECT_COLORS } from "../../../../shared/EmojiSelect/constants";

const GoalsModals = {
  [GoalCreationModalsTypes.CLOSE_SUBMIT]: GoalCreationCloseSubmitModal,
  [GoalCreationModalsTypes.WONT_DO_SUBMIT]: GoalWontDoSubmitModal,
};

export class GoalCreationModalStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  listWithCreator = new TasksListWithCreatorStore(this.root);
  finishedList = new TasksListStore(this.root);

  modals = new ModalsController(GoalsModals);

  keyMap = {
    CREATE: ['meta+enter', 'meta+s'],
    CANCEL: ['escape'],
  };

  hotkeyHandlers = {
    CREATE: (e) => {
      e.preventDefault();
      this.handleSave();
    },
    BACK: () => {
      this.handleBack();
    },
    CANCEL: () => {
      this.handleClose();
    },
  };

  resizableConfig: ResizableGroupConfig[] = [
    {
      size: 3,
    },
    {
      size: 0,
      width: 400
    },
    {
      size: 0,
    },
  ];

  onClose: GoalCreationModalProps['onClose'];
  onSave: GoalCreationModalProps['onSave'];

  isOpen = true;
  isUpdating: boolean = false;
  isTaskExpanded = false;
  isEmojiPickerOpen = false;
  isDescriptionLoading: boolean = true;
  isGoalCreatingOrUpdating: boolean = false;
  draggingTask: TaskData | null = null;
  goals: GoalData[] = [];
  currentGoalIndex: number = 0;
  error: string = '';

  goal: GoalData = {
    id: uuidv4(),
    title: '',
    startDate: '',
    targetDate: '',
    spaceId: '',
    status: GoalStatus.TODO,
    icon: {
      type: GoalIconVariants.EMOJI,
      color: '',
      value: '',
    },
  };
  initialGoal: GoalData = cloneDeep(this.goal);
  description: DescriptionData = {
    id: uuidv4(),
    content: undefined,
  };
  initialDescription: DescriptionData = cloneDeep(this.description);
  tasksDescriptions: Record<string, DescriptionData> = {};

  get taskProps() {
    return {
      task: this.listWithCreator.list.openedTaskData,
      hasNext: this.listWithCreator.list.hasNextTask,
      hasPrevious: this.listWithCreator.list.hasPrevTask,
      isEditorFocused: this.listWithCreator.list.isEditorFocused,
      isExpanded: this.isTaskExpanded,
      delayedCreation: !this.isUpdating,
      disableSpaceChange: true,
      disableGoalChange: true,
      disableReferenceChange: true,
      callbacks: {
        ...this.listWithCreator.list.taskCallbacks,
        onCollapse: () => {
          this.isTaskExpanded = false;
          this.resizableConfig[0].size = 2;
          this.resizableConfig[1].width = 400;
          this.resizableConfig[2].size = 2;
        },
        onExpand: this.handleExpandTask,
        onDescriptionChange: (description: DescriptionData, isNotInitial: boolean) => {
          this.listWithCreator.list.taskCallbacks.onDescriptionChange?.(description, isNotInitial);

          if (isNotInitial) {
            this.tasksDescriptions[description.id] = description;
          } else {
            delete this.tasksDescriptions[description.id];
          }
        }
      },
    };
  }

  get isGoalParamsChanged() {
    return Boolean(
      !isEqual(this.goal, this.initialGoal) ||
      !isEqual(this.description, this.initialDescription) ||
      !isEqual(this.listWithCreator.list.items, this.listWithCreator.list.initialItems) ||
      Object.keys(this.tasksDescriptions).length
    );
  }

  get isGoalFinished() {
    return this.goal.status !== GoalStatus.TODO || this.goal.isArchived;
  }

  handleCloseTask = () => {
    this.resizableConfig[0].size = 3;
    this.resizableConfig[2].size = 0;
  };

  handleOpenTask = () => {
    this.resizableConfig[0].size = 2;
    this.resizableConfig[2].size = 2;
  };

  tasksListCallbacks: TasksListWithCreatorStore['tasksListCallbacks'] = {
    onOpenTask: this.handleOpenTask,
    onCloseTask: this.handleCloseTask,
  };

  handleExpandTask = () => {
    this.isTaskExpanded = true;
    this.resizableConfig[0].size = 0;
    this.resizableConfig[1].width = 0;
    this.resizableConfig[2].size = 1;
  };

  openEmojiPicker = () => {
    this.isEmojiPickerOpen = true;
  };

  closeEmojiPicker = () => {
    this.isEmojiPickerOpen = false;
  };

  handleEmojiSelect = (emoji: string) => {
    this.goal.icon.value = emoji;

    this.handleUpdate({ icon: { ...this.goal.icon, value: emoji } });
  };

  handleColorSelect = (color: string) => {
    this.goal.icon.color = color;

    this.handleUpdate({ icon: { ...this.goal.icon, color } });
  };

  handleTitleChange = (e: SyntheticEvent) => {
    this.goal.title = (e.target as HTMLInputElement).value;
  };

  handleSpaceChange = (value: string) => {
    this.goal.spaceId = value;

    this.handleUpdate({ spaceId: value });
  }

  handleStartDateChange = (value: string) => {
    this.goal.startDate = value;

    if (DatePickerHelpers.isStartDateAfterEndDate(value, this.goal.targetDate)) {
      this.goal.targetDate = '';
    }
  }

  handleTargetDateChange = (value: string) => {
    this.goal.targetDate = value;
  }

  handleDescriptionChange = (value: JSONContent) => {
    this.description.content = value;
  };

  handleGoalParamBlur = () => this.handleUpdate();

  handleNavigateToSpace = (spaceId: string) => {
    this.handleClose(() => this.root.router.push(`/inbox/${spaceId}`));
  };

  handleBack = () => {
    if (!this.isEmojiPickerOpen) {
      this.handleClose();
    } else {
      this.closeEmojiPicker();
    }
  };

  handleNextGoal = () => {
    this.handleSetGoal(this.currentGoalIndex + 1);
  };

  handlePrevGoal = () => {
    this.handleSetGoal(this.currentGoalIndex - 1);
  };

  handleSetGoal = async (index: number) => {
    const goal = cloneDeep(this.goals[index]);

    this.goal = goal;
    this.currentGoalIndex = index;

    await this.loadDescription(goal);
  };

  handleClose = (submitCb?: () => void) => {
    if (!this.isEmojiPickerOpen) {
      if (!this.isUpdating && this.isGoalParamsChanged) {
        this.modals.open({
          type: GoalCreationModalsTypes.CLOSE_SUBMIT,
          props: {
            onSubmit: () => {
              this.isOpen = false;
              submitCb?.();
            },
            onClose: this.modals.close,
          },
        });
      } else {
        this.isOpen = false;
        submitCb?.();
      }
    } else {
      this.closeEmojiPicker();
    }
  };

  handleCloseComplete = () => {
    this.onClose?.();
  };

  handleSave = async () => {
    const title = this.goal.title.trim();

    if (!title) {
      this.error = 'Please fill in the title of goal';
      return;
    }

    if (!this.isGoalParamsChanged) {
      this.isOpen = false;
      return;
    }

    const goal = {
      ...this.goal,
      descriptionId: this.description.id,
      title,
    };

    try {
      this.isGoalCreatingOrUpdating = true;
      await this.onSave?.({
        goal,
        description: this.description,
        tasksData: {
          tasks: Object.values(toJS(this.listWithCreator.list.items)),
          order: this.listWithCreator.list.order,
          descriptions: Object.values(this.tasksDescriptions),
        }
      });

      this.isOpen = false;
      this.isGoalCreatingOrUpdating = false;
    } catch (e) {
      this.isGoalCreatingOrUpdating = false;
    }
  };

  handleUpdateStatus = (status: GoalStatus) => {
    if (this.goal.status !== status) {
      if (status === GoalStatus.WONT_DO) {
        this.modals.open({
          type: GoalCreationModalsTypes.WONT_DO_SUBMIT,
          props: {
            onSubmit: async (wontDoReason) => {
              await this.handleUpdate({ status, wontDoReason });
              this.modals.close();
            },
            onClose: this.modals.close,
          },
        });
      } else {
        this.handleUpdate({ status });
      }
    }
  };

  handleUpdate = async (data?: Partial<GoalData>) => {
    if (!this.isUpdating) {
      return;
    }

    const updatedGoal = { ...this.goal, ...data, };

    await this.onSave({ goal: updatedGoal });

    this.goal = updatedGoal;
    this.goals[this.currentGoalIndex] = updatedGoal;
  };

  get sensors() {
    return [
      (api) => {
        this.listWithCreator.list.draggableList.setDnDApi(api);
        this.finishedList.draggableList.setDnDApi(api);
      },
    ];
  }

  handleDragStart = (result) => {
    this.listWithCreator.list.draggableList.startDragging();
    this.finishedList.draggableList.startDragging();

    this.draggingTask = this.listWithCreator.list.items[result.draggableId];
  };

  handleDragEnd = () => {
    this.listWithCreator.list.draggableList.endDragging();
    this.finishedList.draggableList.endDragging();

    this.draggingTask = null;
  };

  loadDescription = async (goal: GoalData) => {
    if (goal.descriptionId) {
      this.isDescriptionLoading = true;
      const description =
        (await this.root.api.descriptions.get(goal.descriptionId)) || undefined;

      runInAction(() => {
        this.description = description;
        this.initialDescription = cloneDeep(description);
        this.isDescriptionLoading = false;
      });
    }

    runInAction(() => {
      this.isDescriptionLoading = false;
    });
  }

  init = async () => {
    await EmojiStore.loadIfNotLoaded();

    if (!this.goal.icon.value && !this.goal.icon.color) {
      const selectedCategories = ['people', 'activity', 'objects'];
      const categories = EmojiStore.emojiData.categories.filter(({ id }) =>
        selectedCategories.includes(id)
      );
      const emojiKeys = categories.reduce((acc, category) => {
        return [...acc, ...category.emojis];
      }, []);

      const randomEmojiKey: any =
        emojiKeys[Math.floor(Math.random() * emojiKeys.length)];
      const randomEmoji = EmojiStore.emojiData.emojis[randomEmojiKey];

      if (randomEmoji) {
        this.goal.icon.value = randomEmoji.skins[0].native;
      }

      this.goal.icon.color = EMOJI_SELECT_COLORS[Math.floor(Math.random() * EMOJI_SELECT_COLORS.length)];

      this.initialGoal = cloneDeep(this.goal);
    }
  };

  update = async ({ onClose, onSave, goals = [], goalId }: GoalCreationModalProps) => {
    this.onClose = onClose;
    this.onSave = onSave;
    this.goals = cloneDeep(goals);

    const goalIndex = goals.findIndex((goal) => goal.id === goalId);
    const goal = { ...this.goal, ...goals[goalIndex] };

    this.currentGoalIndex = goalIndex;
    this.goal = goal;
    this.initialGoal = cloneDeep(goal);

    if (goalId) {
      this.isUpdating = true;
    }

    await this.loadDescription(goal);
  };
}

export const {
  StoreProvider: GoalCreationModalStoreProvider,
  useStore: useGoalCreationModalStore,
} = getProvider(GoalCreationModalStore);
