import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { GoalData, GoalIconVariants, GoalStatus } from '../../types';
import { KeyboardEvent, SyntheticEvent } from 'react';
import { Editor, JSONContent } from '@tiptap/core';
import { v4 as uuidv4 } from 'uuid';
import { DescriptionData } from '../../../../../types/description';
import { ResizableGroupConfig } from '../../../../shared/ResizableGroup/store';
import { TasksListWithCreatorStore } from '../../../../shared/TasksListWithCreator/store';
import { TaskData } from '../../../../shared/TasksList/types';
import { NavigationDirections } from '../../../../../types/navigation';
import { EmojiStore } from '../../../../../stores/EmojiStore';
import { ModalsController } from '../../../../../helpers/ModalsController';
import { GoalCreationModalProps, GoalCreationModalsTypes } from './types';
import { GoalCreationCloseSubmitModal } from './modals/GoalCreationCloseSubmitModal';
import { DatePickerHelpers } from '../../../../shared/DatePicker/helpers';
import { cloneDeep, isEqual } from 'lodash';
import { GoalWontDoSubmitModal } from '../GoalWontDoSubmitModal';
import { EMOJI_SELECT_COLORS } from '../../../../shared/EmojiSelect/constants';
import { NavigationHelper } from '../../../../../helpers/NavigationHelper';
import { ActionMenuStore } from '../../../../shared/ActionMenu/store';
import { GlobalHooks } from '../../../../../helpers/GlobalHooksHelper';
import { GOALS_STATUSES_HOTKEYS } from './constants';

const GoalsModals = {
  [GoalCreationModalsTypes.CLOSE_SUBMIT]: GoalCreationCloseSubmitModal,
  [GoalCreationModalsTypes.WONT_DO_SUBMIT]: GoalWontDoSubmitModal,
};

export class GoalCreationModalStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  listWithCreator = new TasksListWithCreatorStore(this.root);

  modals = new ModalsController(GoalsModals);

  selectStatus = new ActionMenuStore(this.root);

  keyMap = {
    CREATE: ['meta+s', 'ctrl+enter'],
    CANCEL: ['escape'],
    CHANGE_STATUS: ['s'],
    START_EDITING: ['space'],
    HANDLE_ARCHIVE: ['alt+a'],
    OPEN_COMMENT_POPOVER: ['c'],
    OPEN_INFO_POPOVER: ['alt+i'],
    NEXT_GOAL: ['alt+down'],
    PREV_GOAL: ['alt+up'],
    CHANGE_STATUS_TO_TODO: [GOALS_STATUSES_HOTKEYS[GoalStatus.TODO]],
    CHANGE_STATUS_TO_DONE: [GOALS_STATUSES_HOTKEYS[GoalStatus.DONE]],
    CHANGE_STATUS_TO_WONT_DO: [GOALS_STATUSES_HOTKEYS[GoalStatus.WONT_DO]],
  };

  hotkeyHandlers = {
    CREATE: (e: KeyboardEvent) => {
      e.preventDefault();

      if (!this.isUpdating && !this.modals.isOpen && !this.isSpaceCreateModalOpened) {
        this.handleSave();
      }
    },
    CANCEL: () => {
      if (!this.listWithCreator.list.openedTask) {
        this.handleSimpleClose();
      }
    },
    CHANGE_STATUS: () => {
      if (this.isUpdating && !this.selectStatus.isMenuOpen) {
        this.selectStatus.openMenu();
      }
    },
    START_EDITING: () => {
      this.handleTitleFocus();
    },
    HANDLE_ARCHIVE: () => {
      this.handleArchiveGoal();
    },
    OPEN_COMMENT_POPOVER: () => {
      this.toggleCommentPopover(true);
    },
    OPEN_INFO_POPOVER: () => {
      this.toggleInfoPopover(true);
    },
    NEXT_GOAL: () => {
      this.handleNextGoal();
    },
    PREV_GOAL: () => {
      this.handlePrevGoal();
    },
    CHANGE_STATUS_TO_TODO: () => {
      this.handleUpdateStatus(GoalStatus.TODO);
    },
    CHANGE_STATUS_TO_DONE: () => {
      this.handleUpdateStatus(GoalStatus.DONE);
    },
    CHANGE_STATUS_TO_WONT_DO: () => {
      this.handleUpdateStatus(GoalStatus.WONT_DO);
    },
  };

  globalHooks = {
    [GlobalHooks.MetaEnter]: () => {
      if (this.isUpdating) {
        (document.activeElement as HTMLInputElement).blur();
        this.handleSimpleClose();
      } else {
        this.handleSave();
      }
    }
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
  isDescriptionLoading: boolean = true;
  isGoalCreatingOrUpdating: boolean = false;
  draggingTask: TaskData | null = null;
  goals: GoalData[] = [];
  currentGoalIndex: number = 0;
  error: string = '';
  isCommentPopoverOpened: boolean = false;
  isInfoPopoverOpened: boolean = false;
  isSpaceCreateModalOpened: boolean = false;

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

  titleInputRef: HTMLInputElement;
  editorRef: Editor;
  emojiSelectRef: HTMLButtonElement;
  statusSelectTriggerRef: HTMLButtonElement;

  setTitleFocusTimeout: NodeJS.Timeout;
  setStatusSelectFocusTimeout: NodeJS.Timeout;

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

  handleOpenSpaceCreateModal = (isOpen: boolean) => {
    this.isSpaceCreateModalOpened = isOpen;
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

  handleStartDateChange = async (value: string) => {
    this.goal.startDate = value;

    if (DatePickerHelpers.isStartDateAfterEndDate(value, this.goal.targetDate)) {
      this.goal.targetDate = '';
    }

    await this.handleUpdate();
  }

  handleTargetDateChange = (value: string) => {
    this.goal.targetDate = value;
    return this.handleUpdate({ ...this.goal, targetDate: value });
  }

  handleDescriptionChange = (value: JSONContent) => {
    this.description.content = value;
  };

  handleGoalParamBlur = () => this.handleUpdate();

  handleNavigateToSpace = (spaceId: string) => {
    this.handleClose(() => this.root.router.push(`/inbox/${spaceId}`));
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

  handleSimpleClose = () => {
    this.handleClose();
  };

  handleClose = (submitCb?: () => void) => {
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
      createdDate: new Date().toISOString(),
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

  setFocusToStatusSelect = () => {
    this.setStatusSelectFocusTimeout = setTimeout(() => {
      this.statusSelectTriggerRef.focus();
    }, 0);
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
              this.setFocusToStatusSelect();
            },
            onClose: () => {
              this.modals.close();
              this.setFocusToStatusSelect();
            },
          },
        });
      } else {
        this.handleUpdate({ status });
      }
    }
  };

  handleArchiveGoal = () => {
    return this.handleUpdate({ isArchived: !this.goal.isArchived })
  };

  handleUpdate = async (data?: Partial<GoalData>) => {
    const updatedGoal = {
      ...this.goal,
      ...data,
    };

    if (!this.isUpdating || !(this.isGoalParamsChanged || !isEqual(this.goal, updatedGoal))) {
      return;
    }

    await this.onSave({ goal: updatedGoal, description: this.description });

    this.goal = updatedGoal;
    this.goals[this.currentGoalIndex] = updatedGoal;
  };

  handleTitleKeyDown = (event: KeyboardEvent) => {
    event.stopPropagation();

    const direction = NavigationHelper.castKeyToDirection(event.key, event.shiftKey);

    if (direction === NavigationDirections.INVARIANT) {
      this.titleInputRef?.blur();
    } else if (
      [NavigationDirections.ENTER, NavigationDirections.DOWN, NavigationDirections.TAB].includes(direction)
    ) {
      this.editorRef?.chain().focus();
    } else if (
      direction == NavigationDirections.BACK || (
        direction === NavigationDirections.LEFT &&
        this.titleInputRef.selectionStart === 0
      )
    ) {
      event.preventDefault();
      this.emojiSelectRef.focus();
    }
  };

  handleTitleFocus = () => {
    this.titleInputRef?.focus();

    this.setTitleFocusTimeout = setTimeout(() => {
      this.titleInputRef.setSelectionRange(
        this.goal.title.length,
        this.goal.title.length
      );
    });
  };

  handleEmojiSelectNavigate = (direction: NavigationDirections, event: KeyboardEvent) => {
    switch (direction) {
      case NavigationDirections.DOWN:
        return this.editorRef?.chain().focus();
      case NavigationDirections.TAB:
      case NavigationDirections.RIGHT:
        event.preventDefault();
        return this.handleTitleFocus();
      default:
        return;
    }
  };

  handleEditorLeave = (direction: NavigationDirections) => {
    if (direction === NavigationDirections.UP) {
      this.handleTitleFocus();
    }
  };

  toggleCommentPopover = (isOpen: boolean) => {
    this.isInfoPopoverOpened = false;
    this.isCommentPopoverOpened = isOpen;
  };

  toggleInfoPopover = (isOpen: boolean) => {
    this.isCommentPopoverOpened = false;
    this.isInfoPopoverOpened = isOpen;
  };

  setTitleInputRef = (ref: HTMLInputElement) => {
    this.titleInputRef = ref;
  };

  setEditorRef = (ref: Editor) => {
    this.editorRef = ref;
  };

  setEmojiSelectRef = (element: HTMLButtonElement) => {
    this.emojiSelectRef = element;
  };

  setStatusSelectTriggerRef = (element: HTMLButtonElement) => {
    this.statusSelectTriggerRef = element;
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

      const randomEmojiKey = emojiKeys[Math.floor(Math.random() * emojiKeys.length)];
      const randomEmoji = EmojiStore.emojiData.emojis[randomEmojiKey];

      if (randomEmoji) {
        this.goal.icon.value = randomEmoji.skins[0].native;
      }

      this.goal.icon.color = EMOJI_SELECT_COLORS[Math.floor(Math.random() * EMOJI_SELECT_COLORS.length)];

      this.initialGoal = cloneDeep(this.goal);
    }
  };

  destroy = () => {
    clearTimeout(this.setTitleFocusTimeout);
    clearTimeout(this.setStatusSelectFocusTimeout);
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
