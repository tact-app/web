import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { GoalData, GoalIconVariants } from '../../types';
import { SyntheticEvent } from 'react';
import { JSONContent } from '@tiptap/core';
import { v4 as uuidv4 } from 'uuid';
import { init } from 'emoji-mart';
import { DescriptionData } from '../../../../../types/description';
import { ResizableGroupConfig } from "../../../../shared/ResizableGroup/store";
import { TasksListWithCreatorStore } from "../../../../shared/TasksListWithCreator/store";
import { Lists } from "../../../../shared/TasksList/constants";
import { TasksListStore } from "../../../../shared/TasksList/store";
import { TodayBlocks } from "../../../Today/store";
import { TaskData } from "../../../../shared/TasksList/types";

export type GoalCreationModalProps = {
  onClose: () => void;
  onSave: (
    goal: GoalData,
    description?: DescriptionData,
    isNewDescription?: boolean
  ) => void;
  editMode?: boolean;
  goal?: GoalData;
};

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

enum GoalCreateBlocks {
  GOAL_EDITOR = 'GOAL_EDITOR',
  TASK_LIST = 'TASK_LIST',
  FINISHED_TASK_LIST = 'FINISHED_TASK_LIST',
}

export class GoalCreationModalStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);

    init({
      data: async () => {
        const response = await fetch(
          'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
        );

        return response.json();
      },
    });
  }

  listWithCreator = new TasksListWithCreatorStore(this.root);
  finishedList = new TasksListStore(this.root);

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
  isEmojiPickerOpen = false;
  isDescriptionLoading: boolean = true;

  focusedBlock: GoalCreateBlocks;

  goal: GoalData = {
    id: uuidv4(),
    listId: 'default',
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
  taskList: TaskData[] = [];

  emojiStore = new (class EmojiStore {
    data: any = '';
  })();

  tasksListCallbacks: TasksListWithCreatorStore['tasksListCallbacks'] = {
    onFocusLeave: () => null,
    onOpenTask: () => null,
    onCloseTask: () => null,
  };

  taskCreatorCallbacks: TasksListWithCreatorStore['taskCreatorCallbacks'] = {
    onSave: (task) => {
      this.taskList.push(task);
    },
  };
  draggingTask: TaskData | null = null;
  droppableIds = {
    [Lists.TODAY]: TodayBlocks.TODAY_LIST,
    [Lists.WEEK]: TodayBlocks.WEEK_LIST,
    'week-button': TodayBlocks.WEEK_LIST,
  };

  get isReadyForSave() {
    return !!this.goal.title;
  }

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
  }

  handleTargetDateChange = (value: string) => {
    this.goal.targetDate = value;
  }

  handleBack = () => {
    if (!this.isEmojiPickerOpen) {
      this.handleClose();
    } else {
      this.closeEmojiPicker();
    }
  };

  handleClose = () => {
    if (!this.isEmojiPickerOpen) {
      this.isOpen = false;
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
        ...this.goal,
        descriptionId: this.description.id,
      };
      this.onSave?.(goal, this.description);

      this.handleClose();
    }
  };

  handleDescriptionChange = (value: JSONContent) => {
    this.description.content = value;
  };

  get isTasksListHotkeysEnabled() {
    return this.focusedBlock === GoalCreateBlocks.TASK_LIST;
  }

  get isFinishedTaskListHotkeysEnabled() {
    return this.focusedBlock === GoalCreateBlocks.FINISHED_TASK_LIST;
  }

  get sensors() {
    return [
      (api) => {
        this.listWithCreator.list.draggableList.setDnDApi(api);
        this.finishedList.draggableList.setDnDApi(api);
      },
    ];
  }

  getListByName = (name: TodayBlocks) => {
    return name === TodayBlocks.TODAY_LIST
      ? this.listWithCreator.list
      : this.finishedList;
  };

  handleDragStart = (result) => {
    this.listWithCreator.list.draggableList.startDragging();
    this.finishedList.draggableList.startDragging();

    const taskId = result.draggableId;
    const blockName = this.droppableIds[result.source.droppableId];
    const list = this.getListByName(blockName);

    this.draggingTask = list.items[taskId];
  };

  handleDragEnd = (result) => {
    if (result?.destination) {
      const destinationId = result.destination.droppableId;
      const sourceId = result.source.droppableId;

      const destinationBlock = this.droppableIds[destinationId];
      const sourceBlock = this.droppableIds[sourceId];

      const isDifferentList = destinationBlock !== sourceBlock;

      if (!isDifferentList) {
        if (destinationBlock === TodayBlocks.TODAY_LIST) {
          this.listWithCreator.list.draggableList.endDragging(result);
          this.finishedList.draggableList.endDragging();
        } else if (destinationBlock === TodayBlocks.WEEK_LIST) {
          this.finishedList.draggableList.endDragging(result);
          this.listWithCreator.list.draggableList.endDragging();
        } else {
          this.listWithCreator.list.draggableList.endDragging();
          this.finishedList.draggableList.endDragging();
        }
      } else {
        if (destinationBlock === TodayBlocks.TODAY_LIST) {
          const task = this.finishedList.detachTask(result.draggableId);

          this.listWithCreator.list.receiveTasks(
            this.finishedList.listId,
            this.listWithCreator.list.listId,
            [task],
            result.destination.index
          );
        } else if (destinationBlock === TodayBlocks.WEEK_LIST) {
          const task = this.listWithCreator.list.detachTask(
            result.draggableId
          );

          this.finishedList.receiveTasks(
            this.listWithCreator.list.listId,
            this.finishedList.listId,
            [task],
            result.destination.index
          );
        }

        this.listWithCreator.list.draggableList.endDragging();
        this.finishedList.draggableList.endDragging();
      }
    } else {
      this.listWithCreator.list.draggableList.endDragging();
      this.finishedList.draggableList.endDragging();
    }

    this.draggingTask = null;
  };

  init = async () => {
    const data = await import('@emoji-mart/data');

    runInAction(() => {
      this.emojiStore.data = data.default;

      if (!this.goal.icon.value && !this.goal.icon.color) {
        const data = this.emojiStore.data;
        const selectedCategories = ['people', 'activity', 'objects'];
        const categories = data.categories.filter(({ id }) =>
          selectedCategories.includes(id)
        );
        const emojiKeys = categories.reduce((acc, category) => {
          return [...acc, ...category.emojis];
        }, []);

        const randomEmojiKey: any =
          emojiKeys[Math.floor(Math.random() * emojiKeys.length)];
        const randomEmoji = data.emojis[randomEmojiKey];

        if (randomEmoji) {
          this.goal.icon.value = randomEmoji.skins[0].native;
        }

        this.goal.icon.color = colors[Math.floor(Math.random() * colors.length)];
      }
    });
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

    console.log(this.goal)

    runInAction(() => {
      this.isDescriptionLoading = false;
    });
  };
}

export const {
  StoreProvider: GoalCreationModalStoreProvider,
  useStore: useGoalCreationModalStore,
} = getProvider(GoalCreationModalStore);
