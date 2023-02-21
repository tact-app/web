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
  TaskStatus,
} from '../../shared/TasksList/types';
import { TasksListProps, TasksListStore } from '../../shared/TasksList/store';
import { ResizableGroupConfig } from '../../shared/ResizableGroup/store';
import {
  TasksListWithCreatorProps,
  TasksListWithCreatorStore,
} from '../../shared/TasksListWithCreator/store';
import { Lists, referenceToList } from '../../shared/TasksList/constants';
import { CalendarProps, CalendarStore } from './components/Calendar/store';

const FOCUS_MODE_WIDTH = 300;

export enum TodayBlocks {
  FOCUS_CONFIGURATION = 'FOCUS_CONFIGURATION',
  TODAY_LIST = 'TODAY_LIST',
  WEEK_LIST = 'WEEK_LIST',
  CALENDAR = 'CALENDAR',
  TASK = 'TASK',
}

export class TodayStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  todayListWithCreator = new TasksListWithCreatorStore(this.root);
  weekList = new TasksListStore(this.root);
  focusConfiguration = new FocusConfigurationStore(this.root);
  calendar = new CalendarStore(this.root);

  focusModeConfiguration: FocusConfigurationData = {
    id: 'default',
    goals: [],
    showImportant: false,
  };

  draggingTask: TaskData | null = null;
  lastFocusedBlock: TodayBlocks = TodayBlocks.TODAY_LIST;
  openedTaskBlock: TodayBlocks = TodayBlocks.TODAY_LIST;
  focusedBlock: TodayBlocks = TodayBlocks.TODAY_LIST;
  shouldSetFirstFocus: boolean = false;

  currentFocusedBlock: TodayBlocks | null = null;

  shouldOpenCalendar: boolean = false;
  isCalendarExpanded: boolean = true;
  isCalendarFullScreen: boolean = false;
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
      size: 0,
      minWidth: 340,
    },
    {
      size: 2,
      minWidth: 530,
      width: undefined,
    },
  ];

  droppableIds = {
    [Lists.TODAY]: TodayBlocks.TODAY_LIST,
    [Lists.WEEK]: TodayBlocks.WEEK_LIST,
    'week-button': TodayBlocks.WEEK_LIST,
  };

  keyMap = {
    FOCUS_INPUT: 'n',
    FOCUS_MODE: 'f',
    SILENT_FOCUS_MODE: 'shift+f',
    SWITCH_LIST_TODAY: ['t', 'alt+shift+up'],
    SWITCH_LIST_WEEK: ['w', 'alt+shift+down'],
    MOVE_TASK: ['alt+s'],
    TOGGLE_CALENDAR: 'c',
    TOGGLE_CALENDAR_FULL_SCREEN: ['meta+e', 'ctrl+e'],
  };

  hotkeyHandlers = {
    FOCUS_INPUT: () => {
      this.todayListWithCreator.list.removeFocus();
      this.weekList.removeFocus();
      this.todayListWithCreator.creator.setFocus(true);
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
      this.switchList(TodayBlocks.TODAY_LIST, true);
    },
    SWITCH_LIST_WEEK: () => {
      this.switchList(TodayBlocks.WEEK_LIST, true);
    },
    TOGGLE_CALENDAR: () => {
      this.toggleCalendar();
    },
    TOGGLE_CALENDAR_FULL_SCREEN: (e) => {
      e.preventDefault();
      this.isCalendarExpanded && this.toggleCalendarFullScreen();
    },
  };

  get sensors() {
    return [
      (api) => {
        this.todayListWithCreator.list.draggableList.setDnDApi(api);
        this.weekList.draggableList.setDnDApi(api);
      },
    ];
  }

  get isHotkeysEnabled() {
    return (
      !this.todayListWithCreator.list.modals.controller.isOpen &&
      !this.weekList.modals.controller.isOpen
      && !this.root.isModalOpen
    );
  }

  get openedTask() {
    return (
      this.todayListWithCreator.list.openedTask || this.weekList.openedTask
    );
  }

  get isTasksListHotkeysEnabled() {
    return this.focusedBlock === TodayBlocks.TODAY_LIST;
  }

  get isWeekListHotkeysEnabled() {
    return this.focusedBlock === TodayBlocks.WEEK_LIST;
  }

  get taskProps() {
    const store =
      this.openedTaskBlock === TodayBlocks.TODAY_LIST
        ? this.todayListWithCreator.list
        : this.weekList;

    return {
      task: store.openedTaskData,
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
    return this.focusedBlock === TodayBlocks.TODAY_LIST
      ? this.todayListWithCreator.list
      : this.weekList;
  }

  get lastFocusedList() {
    return this.lastFocusedBlock === TodayBlocks.TODAY_LIST
      ? this.todayListWithCreator.list
      : this.weekList;
  }

  get allTasks() {
    return {
      ...this.todayListWithCreator.list.items,
      ...this.weekList.items,
    };
  }

  closeTask = () => {
    this.currentList.closeTask();
  };

  toggleWeekList = () => {
    this.isWeekExpanded = !this.isWeekExpanded;

    if (!this.isWeekExpanded && this.focusedBlock === TodayBlocks.WEEK_LIST) {
      this.switchList(TodayBlocks.TODAY_LIST, true);
    }
  };

  getListByName = (name: TodayBlocks) => {
    return name === TodayBlocks.TODAY_LIST
      ? this.todayListWithCreator.list
      : this.weekList;
  };

  getItemsCount = () => {
    return (
      this.todayListWithCreator.list.draggableList.activeItems.length +
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

      this.currentFocusedBlock = TodayBlocks.FOCUS_CONFIGURATION;
    } else {
      this.isSilentFocusMode = false;
      this.resizableConfig[0].width = 0;
      this.focusTasksList();
    }
  };

  focusFocusConfiguration = () => {
    this.focusConfiguration.focus();
  };

  focusCalendar = () => {
    if (this.isCalendarExpanded && Object.keys(this.calendar.events).length) {
      this.prepareListsForLeave();
      this.focusedBlock = TodayBlocks.CALENDAR;
      this.calendar.focus();

      return true;
    } else {
      return false;
    }
  };

  handleCalendarFocusLeave = () => {
    this.focusTasksList();
  };

  handleCalendarFocusItem = () => {
    if (this.focusedBlock !== TodayBlocks.CALENDAR) {
      this.prepareListsForLeave();
      this.focusedBlock = TodayBlocks.CALENDAR;
    }

    this.currentFocusedBlock = TodayBlocks.CALENDAR;
  };

  focusTasksList = () => {
    const isRefocusFromFocusConfig = this.focusedBlock === TodayBlocks.FOCUS_CONFIGURATION;
    const newFocusedBlock =
      this.lastFocusedBlock === TodayBlocks.TODAY_LIST
        ? TodayBlocks.WEEK_LIST
        : TodayBlocks.TODAY_LIST;
    const secondList = this.getListByName(newFocusedBlock);

    if (this.lastFocusedList.draggableList.hasFocusableItems) {
      this.focusedBlock = this.lastFocusedBlock;

      if (isRefocusFromFocusConfig) {
        this.lastFocusedList.draggableList.setFocusedItems(
          this.getTasksToFocus(this.lastFocusedList.draggableList.savedFocusedItemIds)
        );
      } else {
        this.lastFocusedList.draggableList.restoreSavedFocusedItems();
      }
    } else if (secondList.draggableList.hasFocusableItems) {
      this.focusedBlock = newFocusedBlock;

      if (isRefocusFromFocusConfig) {
        secondList.draggableList.setFocusedItems(
          this.getTasksToFocus(secondList.draggableList.savedFocusedItemIds)
        );
      } else {
        secondList.draggableList.restoreSavedFocusedItems();
      }
    }

    this.currentFocusedBlock = TodayBlocks.TODAY_LIST;
  };

  getTasksToFocus = (savedFocusedTasks: string[]) => {
    const allTasks = this.allTasks;

    return savedFocusedTasks.filter(
      (id) => this.focusModeConfiguration.goals.includes(allTasks[id].goalId)
    );
  }
  prepareListsForLeave = () => {
    const list = this.currentList;

    list.draggableList.saveFocusedItems();
    list.draggableList.resetFocusedItem();

    this.lastFocusedBlock = this.focusedBlock;
  };

  handleFocusConfigurationFocus = () => {
    this.prepareListsForLeave();

    this.focusedBlock = TodayBlocks.FOCUS_CONFIGURATION;
    this.currentFocusedBlock = TodayBlocks.FOCUS_CONFIGURATION;
  };

  handleExpandTask = () => {
    this.isTaskExpanded = true;
    this.resizableConfig[3].width = 0;
    this.resizableConfig[2].size = 1;
    this.resizableConfig[1].size = 0;
    this.resizableConfig[0].width = 0;
  };

  handleCollapseTask = () => {
    this.isTaskExpanded = false;
    this.resetLayout();
  };

  expandCalendar = () => {
    this.isCalendarExpanded = true;

    this.resizableConfig[2].size = 0;
    this.resizableConfig[3].size = 2;
    this.resizableConfig[3].width = undefined;
    this.resizableConfig[3].minWidth = 530;

    this.currentFocusedBlock = TodayBlocks.CALENDAR;
  };

  collapseCalendar = () => {
    this.isCalendarFullScreen = false;
    this.isCalendarExpanded = false;

    this.resizableConfig[1].size = 2;
    this.resizableConfig[2].size = this.openedTask ? 1 : 0;
    this.resizableConfig[3].size = 0;
    this.resizableConfig[3].width = 57;
    this.resizableConfig[3].minWidth = undefined;

    this.currentFocusedBlock = null;
  };

  handleListMinWidth = () => {
    if (this.isCalendarExpanded) {
      this.openFullScreenCalendar();
    } else {
      this.handleExpandTask();
    }
  }

  openFullScreenCalendar = () => {
    this.isCalendarFullScreen = true;

    this.resizableConfig[1].size = 0;
    this.resizableConfig[2].size = 0;
    this.resizableConfig[3].size = 3;
    this.resizableConfig[3].width = undefined;
    this.resizableConfig[3].minWidth = 530;
  };

  closeFullScreenCalendar = () => {
    this.isCalendarFullScreen = false;

    this.resizableConfig[1].size = 2;
    this.resizableConfig[2].size = 0;
    this.resizableConfig[3].size = 2;
    this.resizableConfig[3].width = undefined;
    this.resizableConfig[3].minWidth = 530;
  };

  toggleCalendar = () => {
    if (this.isCalendarExpanded) {
      this.collapseCalendar();
    } else {
      this.expandCalendar();
    }
  };

  toggleCalendarFullScreen = () => {
    if (!this.isCalendarFullScreen) {
      this.openFullScreenCalendar();
    } else {
      this.closeFullScreenCalendar();
    }
  };

  handleOpenTask = () => {
    this.resizableConfig[2].size = 1;

    if (this.isCalendarExpanded) {
      this.collapseCalendar();
      this.shouldOpenCalendar = true;
    }
  };

  handleCloseTask = (doNotOpenCalendar = false) => {
    this.handleCollapseTask();
    this.resizableConfig[2].size = 0;

    if (!doNotOpenCalendar && this.shouldOpenCalendar && !this.isCalendarExpanded) {
      this.expandCalendar();
      this.shouldOpenCalendar = false;
    }
  };

  resetLayout = () => {
    this.isTaskExpanded = false;
    if(!this?.isCalendarExpanded) this.resizableConfig[3].width = 57;
    this.resizableConfig[2].size = this.openedTask ? 1 : 0;
    this.resizableConfig[1].size = 2;
    this.resizableConfig[0].width =
      this.isFocusModeActive && !this.isSilentFocusMode ? FOCUS_MODE_WIDTH : 0;
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
      !this.todayListWithCreator.list.hasTasks &&
      this.weekList.draggableList.hasFocusableItems
    ) {
      this.switchList(TodayBlocks.WEEK_LIST);
      return true;
    } else if (direction === NavigationDirections.RIGHT) {
      if (this.isCalendarExpanded) {
        return this.focusCalendar();
      } else if (this.openedTask) {
        this.todayListWithCreator.list.focusEditor();
      }
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
    } else if (direction === NavigationDirections.RIGHT) {
      if (this.isCalendarExpanded) {
        return this.focusCalendar();
      } else if (this.openedTask) {
        this.weekList.focusEditor();
      }
    }
  };

  handleDragStart = (result) => {
    this.todayListWithCreator.list.draggableList.startDragging();
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
        if (destinationBlock === TodayBlocks.TODAY_LIST) {
          this.todayListWithCreator.list.draggableList.endDragging(result);
          this.weekList.draggableList.endDragging();
        } else if (destinationBlock === TodayBlocks.WEEK_LIST) {
          this.weekList.draggableList.endDragging(result);
          this.todayListWithCreator.list.draggableList.endDragging();
        } else {
          this.todayListWithCreator.list.draggableList.endDragging();
          this.weekList.draggableList.endDragging();
        }
      } else {
        if (destinationBlock === TodayBlocks.TODAY_LIST) {
          const task = this.weekList.detachTask(result.draggableId);

          this.todayListWithCreator.list.receiveTasks(
            this.weekList.listId,
            this.todayListWithCreator.list.listId,
            [task],
            result.destination.index
          );
        } else if (destinationBlock === TodayBlocks.WEEK_LIST) {
          const task = this.todayListWithCreator.list.detachTask(
            result.draggableId
          );

          this.weekList.receiveTasks(
            this.todayListWithCreator.list.listId,
            this.weekList.listId,
            [task],
            result.destination.index
          );
        }

        this.todayListWithCreator.list.draggableList.endDragging();
        this.weekList.draggableList.endDragging();
      }
    } else {
      this.todayListWithCreator.list.draggableList.endDragging();
      this.weekList.draggableList.endDragging();
    }

    this.draggingTask = null;
  };

  handleCalendarHotkey = () => {};

  handleCalendarTaskStatusChange = (
    taskId: string,
    newStatus: TaskStatus
  ) => {};

  switchList = (blockName: TodayBlocks, saveState?: boolean) => {
    if (blockName !== this.focusedBlock) {
      if (blockName === TodayBlocks.WEEK_LIST && !this.weekList.hasTasks) {
        return;
      }

      if (blockName === TodayBlocks.WEEK_LIST) {
        this.isWeekExpanded = true;
      }

      const fromList =
        this.focusedBlock === TodayBlocks.TODAY_LIST
          ? this.todayListWithCreator.list
          : this.weekList;
      const toList =
        blockName === TodayBlocks.TODAY_LIST
          ? this.todayListWithCreator.list
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
        blockName === TodayBlocks.TODAY_LIST &&
        !this.todayListWithCreator.list.hasTasks
      ) {
        this.todayListWithCreator.creator.setFocus(true);
      }
    }
  };

  sendTasks = (blockName: TodayBlocks, tasks: TaskData[]) => {
    const fromList =
      blockName === TodayBlocks.WEEK_LIST
        ? this.todayListWithCreator.list
        : this.weekList;
    const toList =
      blockName === TodayBlocks.WEEK_LIST
        ? this.weekList
        : this.todayListWithCreator.list;

    toList.receiveTasks(fromList.listId, toList.listId, tasks);

    return true;
  };

  loadFocusModeConfiguration = async () => {
    this.focusModeConfiguration = await this.root.api.focusConfigurations.get(
      'default'
    );
  };

  setFocusModeConfiguration = (data: FocusConfigurationData) => {
    this.focusModeConfiguration = data;

    if (!data.goals.includes(this.allTasks[this.openedTask]?.goalId)) {
      this.closeTask();
    }
  };

  update = () => null;

  setShouldSetFirstFocus = () => {
    this.shouldSetFirstFocus = true;
  };

  setFirstFocus = () => {
    if (this.todayListWithCreator.list.order.length) {
      this.todayListWithCreator.list.draggableList.focusFirstItem();
    } else {
      this.todayListWithCreator.creator.setFocus(true);
    }

    this.shouldSetFirstFocus = false;
  };

  todayTasksListCallbacks: TasksListProps['callbacks'] = {
    onInit: this.setShouldSetFirstFocus,
    onFocusLeave: this.handleTasksListFocusLeave,
    onCloseTask: this.handleCloseTask,
    onFocusChange: () => this.switchList(TodayBlocks.TODAY_LIST),
    onSendTask: (tasks: TaskData[]) =>
      this.sendTasks(TodayBlocks.WEEK_LIST, tasks),
    onOpenTask: this.handleOpenTask,
  };

  taskCreatorCallbacks: TasksListWithCreatorProps['taskCreatorCallbacks'] = {
    onSave: (task, withShift, referenceId) => {
      if (!referenceId || referenceToList[referenceId] === Lists.TODAY) {
        return this.todayListWithCreator.list.createTask(task, withShift);
      } else if (referenceToList[referenceId] === Lists.WEEK) {
        return this.weekList.createTask(task, referenceId === 'tomorrow');
      }
    },
    onForceSave: (taskId: string, referenceId: string) => {
      if (!referenceId || referenceToList[referenceId] === Lists.TODAY) {
        this.todayListWithCreator.list.openTask(taskId);
        this.todayListWithCreator.list.draggableList.setFocusedItem(taskId);
      } else if (referenceToList[referenceId] === Lists.WEEK) {
        this.weekList.openTask(taskId);
        this.weekList.draggableList.setFocusedItem(taskId);
      }
    },
  };

  weekTasksListCallbacks: TasksListProps['callbacks'] = {
    onFocusLeave: this.handleWeekListFocusLeave,
    onFocusChange: () => this.switchList(TodayBlocks.WEEK_LIST),
    onEmpty: () => this.switchList(TodayBlocks.TODAY_LIST, true),
    onSendTask: (tasks: TaskData[]) =>
      this.sendTasks(TodayBlocks.TODAY_LIST, tasks),
    onOpenTask: this.handleOpenTask,
    onCloseTask: this.handleCloseTask,
  };

  focusConfigurationCallbacks: FocusConfigurationProps['callbacks'] = {
    onChange: this.setFocusModeConfiguration,
    onClose: this.toggleFocusMode,
    onFocus: this.handleFocusConfigurationFocus,
    onBlur: this.focusTasksList,
    onGoalCreateClick: (cb) =>
      this.todayListWithCreator.list.modals.openGoalCreationModal(cb),
  };

  calendarCallbacks: CalendarProps['callbacks'] = {
    onExpand: this.expandCalendar,
    onCollapse: this.collapseCalendar,
    onOpenFullScreen: this.openFullScreenCalendar,
    onCloseFullScreen: this.closeFullScreenCalendar,
    onTaskStatusChange: this.handleCalendarTaskStatusChange,
    onFocusLeave: this.handleCalendarFocusLeave,
    onFocusItem: this.handleCalendarFocusItem,
  };
}

export const { useStore: useTodayStore, StoreProvider: TodayStoreProvider } =
  getProvider(TodayStore);
