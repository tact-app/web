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
  isTaskExpanded = false;
  isEmojiPickerOpen = false;
  isDescriptionLoading: boolean = true;
  draggingTask: TaskData | null = null;
  titleHasError: boolean = false;

  goal: GoalData = {
    id: uuidv4(),
    listId: uuidv4(),
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
      },
    };
  }

  get isReadyForSave() {
    return !!this.goal.title && !this.titleHasError;
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
    const value = (e.target as HTMLInputElement).value;

    this.goal.title = value;
    this.titleHasError = value && !/\w/.test(value);
  };

  handleSpaceChange = (value: string) => {
    this.goal.spaceId = value;
  }

  handleStartDateChange = (value: string) => {
    this.goal.startDate = value;
  }

  handleTargetDateChange = (value: string) => {
    this.goal.targetDate = value;
  }

  handleDescriptionChange = (value: JSONContent) => {
    this.description.content = value;
  };

  handleBack = () => {
    if (!this.isEmojiPickerOpen) {
      this.handleClose();
    } else {
      this.closeEmojiPicker();
    }
  };

  handleClose = () => {
    if (!this.isEmojiPickerOpen) {
      this.modals.open({
        type: GoalCreationModalsTypes.CLOSE_SUBMIT,
        props: {
          onSubmit: () => {
            this.isOpen = false;
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

  handleSave = () => {
    if (this.isReadyForSave) {
      const goal = {
        ...toJS(this.goal),
        descriptionId: this.description.id,
      };

      this.onSave?.(goal, this.description, Object.values(toJS(this.listWithCreator.list.items)));

      this.handleClose();
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
