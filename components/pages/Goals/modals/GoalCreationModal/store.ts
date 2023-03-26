import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { GoalData, GoalIconVariants } from '../../types';
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

export const colors = [
  'red.200',
  'orange.100',
  'orange.200',
  'yellow.200',
  'green.200',
  'blue.200',
  'teal.200',
  'purple.200',
];

const GoalsModals = {
  [GoalCreationModalsTypes.CLOSE_SUBMIT]: GoalCreationCloseSubmitModal,
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
  error: string = '';
  tasksDescriptions: Record<string, DescriptionData> = {};

  goal: GoalData = {
    id: uuidv4(),
    title: '',
    startDate: '',
    targetDate: '',
    spaceId: '',
    icon: {
      type: GoalIconVariants.EMOJI,
      color: '',
      value: '',
    },
  };
  description: DescriptionData = {
    id: uuidv4(),
    content: undefined,
  };

  get taskProps() {
    return {
      task: this.listWithCreator.list.openedTaskData,
      hasNext: this.listWithCreator.list.hasNextTask,
      hasPrevious: this.listWithCreator.list.hasPrevTask,
      isEditorFocused: this.listWithCreator.list.isEditorFocused,
      isExpanded: this.isTaskExpanded,
      delayedCreation: true,
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
        onDescriptionChange: (description: DescriptionData) => {
          this.listWithCreator.list.taskCallbacks.onDescriptionChange?.(description);
          this.tasksDescriptions[description.id] = description;
        }
      },
    };
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
  };

  handleColorSelect = (color: string) => {
    this.goal.icon.color = color;
  };

  handleTitleChange = (e: SyntheticEvent) => {
    this.goal.title = (e.target as HTMLInputElement).value;
  };

  handleSpaceChange = (value: string) => {
    this.goal.spaceId = value;
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

  handleClose = (submitCb?: () => void) => {
    if (!this.isEmojiPickerOpen) {
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
      this.closeEmojiPicker();
    }
  };

  handleCloseComplete = () => {
    this.onClose?.();
  };

  handleSave = async () => {
    if (!this.goal.title) {
      this.error = 'Please fill in the title of goal';
      return;
    }

    const goal = {
      ...this.goal,
      descriptionId: this.description.id,
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

      this.goal.icon.color = colors[Math.floor(Math.random() * colors.length)];
    }
  };

  update = async (props: GoalCreationModalProps) => {
    this.onClose = props.onClose;
    this.onSave = props.onSave;
    this.goal = { ...this.goal, ...props.goal };

    if (props.goal?.id) {
      this.isUpdating = true;
    }

    if (this.goal.descriptionId) {
      this.isDescriptionLoading = true;
      const description =
        (await this.root.api.descriptions.get(
          this.goal.descriptionId
        )) || undefined;

      runInAction(() => {
        this.description = description;
        this.isDescriptionLoading = false;
      });
    }

    runInAction(() => {
      this.isDescriptionLoading = false;
    });
  };
}

export const {
  StoreProvider: GoalCreationModalStoreProvider,
  useStore: useGoalCreationModalStore,
} = getProvider(GoalCreationModalStore);
