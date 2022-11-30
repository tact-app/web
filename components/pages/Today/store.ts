import { RootStore } from '../../../stores/RootStore';
import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import {
  FocusConfigurationData,
  FocusConfigurationProps,
  FocusConfigurationStore,
} from './components/FocusConfiguration/store';
import {
  NavigationDirections,
  TaskData,
  TaskPriority,
} from '../../shared/TasksList/types';
import { TasksListProps, TasksListStore } from '../../shared/TasksList/store';
import { ResizableGroupConfig } from '../../shared/ResizableGroup/store';
import { TasksListWithCreatorStore } from '../../shared/TasksListWithCreator/store';

const FOCUS_MODE_WIDTH = 300;

export enum TodayBlocks {
  FOCUS_CONFIGURATION = 'FOCUS_CONFIGURATION',
  TASKS_LIST = 'TASKS_LIST',
  WEEK_LIST = 'WEEK_LIST',
}

export class TodayStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  listWithCreator = new TasksListWithCreatorStore(this.root);
  weekList = new TasksListStore(this.root);
  focusConfiguration = new FocusConfigurationStore(this.root);

  listId: string = 'default';
  focusModeConfiguration: FocusConfigurationData = {
    id: 'default',
    goals: [],
    showImportant: false,
  };

  draggingTask: TaskData | null = null;
  lastFocusedBlock: TodayBlocks = TodayBlocks.TASKS_LIST;
  openedTaskBlock: TodayBlocks = TodayBlocks.TASKS_LIST;
  focusedBlock: TodayBlocks = TodayBlocks.TASKS_LIST;
  shouldSetFirstFocus: boolean = false;
  isWeekExpanded: boolean = true;
  isTaskExpanded: boolean = false;
  isFocusModeActive: boolean = false;
  isSilentFocusMode: boolean = false;

  resizableConfig: ResizableGroupConfig[] = [
    {
      size: 0,
      width: 0,
      minWidth: FOCUS_MODE_WIDTH,
    },
    {
      size: 2,
      flexible: true,
      minWidth: 400,
    },
    {
      size: 1,
      minWidth: 340,
    },
  ];

  droppableIds = {
    default: TodayBlocks.TASKS_LIST,
    week: TodayBlocks.WEEK_LIST,
    'week-button': TodayBlocks.WEEK_LIST,
  };

  keyMap = {
    FOCUS_INPUT: 'n',
    FOCUS_MODE: 'f',
    SILENT_FOCUS_MODE: 'shift+f',
    SWITCH_LIST_TODAY: ['t', 'alt+shift+arrowup'],
    SWITCH_LIST_WEEK: ['w', 'alt+shift+arrowdown'],
    MOVE_TASK: ['alt+s'],
  };

  hotkeyHandlers = {
    FOCUS_INPUT: () => {
      this.listWithCreator.list.removeFocus();
      this.weekList.removeFocus();
      this.listWithCreator.creator.setFocus(true);
    },
    FOCUS_MODE: (e) => {
      e.preventDefault();
      this.toggleFocusMode();
    },
    SILENT_FOCUS_MODE: (e) => {
      e.preventDefault();
      this.toggleFocusMode(true);
    },
    SWITCH_LIST_TODAY: () => {
      this.switchList(TodayBlocks.TASKS_LIST, true);
    },
    SWITCH_LIST_WEEK: () => {
      this.switchList(TodayBlocks.WEEK_LIST, true);
    },
  };

  get sensors() {
    return [
      (api) => {
        this.listWithCreator.list.draggableList.setDnDApi(api);
        this.weekList.draggableList.setDnDApi(api);
      },
    ];
  }

  get isHotkeysEnabled() {
    return (
      !this.listWithCreator.list.modals.controller.isOpen &&
      !this.weekList.modals.controller.isOpen
    );
  }

  get isTasksListHotkeysEnabled() {
    return this.focusedBlock === TodayBlocks.TASKS_LIST;
  }

  get isWeekListHotkeysEnabled() {
    return this.focusedBlock === TodayBlocks.WEEK_LIST;
  }

  get taskProps() {
    const store =
      this.openedTaskBlock === TodayBlocks.TASKS_LIST
        ? this.listWithCreator.list
        : this.weekList;

    return {
      task: store.openedTaskData,
      spaces: store.spaces,
      tagsMap: store.tagsMap,
      goals: store.goals,
      hasNext: store.hasNextTask,
      hasPrevious: store.hasPrevTask,
      isEditorFocused: store.isEditorFocused,
      isExpanded: this.isTaskExpanded,
      callbacks: {
        ...store.taskCallbacks,
        onExpand: this.handleExpandTask,
        onCollapse: this.handleCollapseTask,
      },
    };
  }

  get currentList() {
    return this.focusedBlock === TodayBlocks.TASKS_LIST
      ? this.listWithCreator.list
      : this.weekList;
  }

  get lastFocusedList() {
    return this.lastFocusedBlock === TodayBlocks.TASKS_LIST
      ? this.listWithCreator.list
      : this.weekList;
  }

  toggleWeekList = () => {
    this.isWeekExpanded = !this.isWeekExpanded;
  };

  getListByName = (name: TodayBlocks) => {
    return name === TodayBlocks.TASKS_LIST
      ? this.listWithCreator.list
      : this.weekList;
  };

  getItemsCount = () => {
    return (
      this.listWithCreator.list.draggableList.activeItems.length +
      this.weekList.draggableList.activeItems.length
    );
  };

  checkFocusModeMatch = (task: TaskData) => {
    // ToDo remove this function due to performance issues
    const { goals, showImportant } = this.focusModeConfiguration;

    if (this.isFocusModeActive && task) {
      const priorityMatch = showImportant
        ? task.priority === TaskPriority.HIGH
        : true;
      const goalMatch = goals.length ? goals.includes(task.goalId) : false;

      if (showImportant && goals.length) {
        return priorityMatch && goalMatch;
      } else if (showImportant) {
        return priorityMatch;
      } else if (goals.length) {
        return goalMatch;
      }
    } else {
      return true;
    }
  };

  toggleFocusMode = (silent?: boolean) => {
    const isOpen = !this.isFocusModeActive;
    this.isFocusModeActive = !this.isFocusModeActive;

    this.resetLayout();

    if (isOpen) {
      this.currentList.draggableList.revalidateFocusedItems();

      const isOpenedTaskFocused = Boolean(
        this.currentList.openedTask &&
          this.checkFocusModeMatch(this.currentList.openedTaskData)
      );

      if (!isOpenedTaskFocused) {
        this.currentList.closeTask();
      }

      if (silent) {
        this.isSilentFocusMode = true;
        this.resizableConfig[0].width = 0;
        this.loadFocusModeConfiguration();

        return;
      } else {
        this.resizableConfig[0].width = FOCUS_MODE_WIDTH;

        setTimeout(this.focusFocusConfiguration);
      }
    } else {
      this.isSilentFocusMode = false;
      this.resizableConfig[0].width = 0;
      this.handleFocusTasksList();
    }
  };

  resetLayout = () => {
    this.isTaskExpanded = false;
    this.resizableConfig[2].size = 1;
    this.resizableConfig[1].size = 2;
    this.resizableConfig[0].width =
      this.isFocusModeActive && !this.isSilentFocusMode ? FOCUS_MODE_WIDTH : 0;
  };

  focusFocusConfiguration = () => {
    this.focusConfiguration.focus();
  };

  handleFocusTasksList = () => {
    const newFocusedBlock =
      this.lastFocusedBlock === TodayBlocks.TASKS_LIST
        ? TodayBlocks.WEEK_LIST
        : TodayBlocks.TASKS_LIST;
    const secondList = this.getListByName(newFocusedBlock);

    if (this.lastFocusedList.draggableList.hasFocusableItems) {
      this.focusedBlock = this.lastFocusedBlock;
      this.lastFocusedList.draggableList.restoreSavedFocusedItems();
      secondList.draggableList.resetSavedFocusedItems();
    } else if (secondList.draggableList.hasFocusableItems) {
      this.focusedBlock = newFocusedBlock;
      secondList.draggableList.restoreSavedFocusedItems();
      this.lastFocusedList.draggableList.resetSavedFocusedItems();
    }
  };

  handleFocusConfigurationFocus = () => {
    const list = this.currentList;

    list.draggableList.saveFocusedItems();
    list.draggableList.resetFocusedItem();

    this.lastFocusedBlock = this.focusedBlock;

    this.focusedBlock = TodayBlocks.FOCUS_CONFIGURATION;
  };

  handleExpandTask = () => {
    this.isTaskExpanded = true;
    this.resizableConfig[2].size = 1;
    this.resizableConfig[1].size = 0;
    this.resizableConfig[0].width = 0;
  };

  handleCollapseTask = () => {
    this.isTaskExpanded = false;
    this.resetLayout();
  };

  handleToggleFocusMode = () => {
    // workaround for @zag-js/focus-visible library
    // it doesn't show focus on elements after mouse click
    document.dispatchEvent(new KeyboardEvent('keyup'));
    this.toggleFocusMode();
  };

  handleTaskMouseDown = () => {
    this.focusedBlock = this.openedTaskBlock;
  };

  handleTasksListFocusLeave = (direction: NavigationDirections) => {
    if (
      direction === NavigationDirections.LEFT &&
      this.isFocusModeActive &&
      !this.isSilentFocusMode
    ) {
      this.focusFocusConfiguration();
      return true;
    } else if (
      direction === NavigationDirections.DOWN &&
      !this.listWithCreator.list.hasTasks &&
      this.weekList.draggableList.hasFocusableItems
    ) {
      this.switchList(TodayBlocks.WEEK_LIST);
      return true;
    }
  };

  handleWeekListFocusLeave = (direction: NavigationDirections) => {
    if (direction === NavigationDirections.UP) {
      this.weekList.draggableList.focusLastItem();
      return true;
    } else if (direction === NavigationDirections.DOWN) {
      this.weekList.draggableList.focusFirstItem();
      return true;
    } else if (
      direction === NavigationDirections.LEFT &&
      this.isFocusModeActive &&
      !this.isSilentFocusMode
    ) {
      this.focusFocusConfiguration();
      return true;
    }
  };

  handleDragStart = (result) => {
    this.listWithCreator.list.draggableList.startDragging();
    this.weekList.draggableList.startDragging();

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
        if (destinationBlock === TodayBlocks.TASKS_LIST) {
          this.listWithCreator.list.draggableList.endDragging(result);
          this.weekList.draggableList.endDragging();
        } else if (destinationBlock === TodayBlocks.WEEK_LIST) {
          this.weekList.draggableList.endDragging(result);
          this.listWithCreator.list.draggableList.endDragging();
        }
      } else {
        if (destinationBlock === TodayBlocks.TASKS_LIST) {
          const task = this.weekList.detachTask(result.draggableId);

          this.listWithCreator.list.receiveTasks(
            this.weekList.listId,
            [task],
            result.destination.index
          );
        } else if (destinationBlock === TodayBlocks.WEEK_LIST) {
          const task = this.listWithCreator.list.detachTask(result.draggableId);

          this.weekList.receiveTasks(
            this.listWithCreator.list.listId,
            [task],
            result.destination.index
          );
        }

        this.listWithCreator.list.draggableList.endDragging();
        this.weekList.draggableList.endDragging();
      }
    }

    this.draggingTask = null;
  };

  switchList = (blockName: TodayBlocks, saveState?: boolean) => {
    if (blockName !== this.focusedBlock) {
      if (blockName === TodayBlocks.WEEK_LIST && !this.weekList.hasTasks) {
        return;
      }

      if (blockName === TodayBlocks.WEEK_LIST) {
        this.isWeekExpanded = true;
      }

      const fromList =
        this.focusedBlock === TodayBlocks.TASKS_LIST
          ? this.listWithCreator.list
          : this.weekList;
      const toList =
        blockName === TodayBlocks.TASKS_LIST
          ? this.listWithCreator.list
          : this.weekList;

      this.focusedBlock = blockName;
      this.lastFocusedBlock = blockName;

      const isTaskOpened = Boolean(fromList.openedTask);
      const isEditorFocused = Boolean(fromList.isEditorFocused);

      if (saveState) {
        fromList.draggableList.saveFocusedItems();

        if (toList.draggableList.hasSavedFocusedItems) {
          toList.draggableList.restoreSavedFocusedItems();
        } else {
          toList.draggableList.focusFirstItem();
        }
      } else {
        fromList.draggableList.resetSavedFocusedItems();

        if (toList.draggableList.focused.length === 0) {
          toList.draggableList.resetSavedFocusedItems();
          toList.draggableList.focusFirstItem();
        }
      }

      fromList.draggableList.resetFocusedItem();

      this.openedTaskBlock = blockName;

      if (isTaskOpened) {
        fromList.closeTask();
        toList.openTask(toList.draggableList.focused[0]);

        if (isEditorFocused) {
          toList.focusEditor();
        } else {
          toList.blurEditor();
        }
      }

      if (
        blockName === TodayBlocks.TASKS_LIST &&
        !this.listWithCreator.list.hasTasks
      ) {
        this.listWithCreator.creator.setFocus(true);
      }
    }
  };

  sendTasks = (blockName: TodayBlocks, tasks: TaskData[]) => {
    const fromList =
      blockName === TodayBlocks.WEEK_LIST
        ? this.listWithCreator.list
        : this.weekList;
    const toList =
      blockName === TodayBlocks.WEEK_LIST
        ? this.weekList
        : this.listWithCreator.list;

    toList.receiveTasks(fromList.listId, tasks);

    return true;
  };

  loadFocusModeConfiguration = async () => {
    this.focusModeConfiguration = await this.root.api.focusConfigurations.get(
      'default'
    );
  };

  setFocusModeConfiguration = (data: FocusConfigurationData) => {
    this.focusModeConfiguration = data;
  };

  update = () => null;

  setShouldSetFirstFocus = () => {
    this.shouldSetFirstFocus = true;
  };

  setFirstFocus = () => {
    if (this.listWithCreator.list.order.length) {
      this.listWithCreator.list.draggableList.focusFirstItem();
    } else {
      this.listWithCreator.creator.setFocus(true);
    }

    this.shouldSetFirstFocus = false;
  };

  tasksListCallbacks: TasksListProps['callbacks'] = {
    onInit: this.setShouldSetFirstFocus,
    onFocusLeave: this.handleTasksListFocusLeave,
    onCloseTask: this.handleCollapseTask,
    onFocusChange: () => this.switchList(TodayBlocks.TASKS_LIST),
    onSendTask: (tasks: TaskData[]) =>
      this.sendTasks(TodayBlocks.WEEK_LIST, tasks),
  };

  weekTasksListCallbacks: TasksListProps['callbacks'] = {
    onFocusLeave: this.handleWeekListFocusLeave,
    onFocusChange: () => this.switchList(TodayBlocks.WEEK_LIST),
    onEmpty: () => this.switchList(TodayBlocks.TASKS_LIST, true),
    onSendTask: (tasks: TaskData[]) =>
      this.sendTasks(TodayBlocks.TASKS_LIST, tasks),
  };

  focusConfigurationCallbacks: FocusConfigurationProps['callbacks'] = {
    onChange: this.setFocusModeConfiguration,
    onClose: this.toggleFocusMode,
    onFocus: this.handleFocusConfigurationFocus,
    onBlur: this.handleFocusTasksList,
    onGoalCreateClick: (cb) =>
      this.listWithCreator.list.modals.openGoalCreationModal(cb),
  };
}

export const { useStore: useTodayStore, StoreProvider: TodayStoreProvider } =
  getProvider(TodayStore);
