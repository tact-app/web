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
import { TaskProps } from '../../shared/Task/store';
import { ResizableGroupConfig } from '../../shared/ResizableGroup/store';
import { TasksListWithCreatorStore } from '../../shared/TasksListWithCreator/store';

const FOCUS_MODE_WIDTH = 300;

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

  shouldSetFirstFocus: boolean = false;
  isWeekExpanded: boolean = true;
  isTasksListFocusSaved: boolean = false;
  isTasksListHotkeysEnabled: boolean = true;
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

  keyMap = {
    FOCUS_INPUT: 'n',
    FOCUS_MODE: 'f',
    SILENT_FOCUS_MODE: 'shift+f',
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
  };

  get isHotkeysEnabled() {
    return !this.listWithCreator.list.modals.controller.isOpen;
  }

  toggleWeekList = () => {
    this.isWeekExpanded = !this.isWeekExpanded;
  };

  getItemsCount = () => {
    return this.listWithCreator.list.draggableList.activeItems.length;
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
      this.listWithCreator.list.draggableList.revalidateFocusedItems();

      const isOpenedTaskFocused = Boolean(
        this.listWithCreator.list.openedTask &&
          this.checkFocusModeMatch(this.listWithCreator.list.openedTaskData)
      );

      if (!isOpenedTaskFocused) {
        this.listWithCreator.list.closeTask();
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
    this.isTasksListHotkeysEnabled = false;
    this.isTasksListFocusSaved = true;
    this.listWithCreator.list.draggableList.saveFocusedItems();
    this.focusConfiguration.focus();
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

  handleTasksListMouseDown = () => {
    this.isTasksListHotkeysEnabled = true;
  };

  handleTasksListFocusLeave = (direction: NavigationDirections) => {
    if (
      direction === NavigationDirections.LEFT &&
      this.isFocusModeActive &&
      !this.isSilentFocusMode
    ) {
      this.focusFocusConfiguration();
      return true;
    }
  };

  handleFocusTasksList = () => {
    if (this.isTasksListFocusSaved) {
      this.listWithCreator.list.draggableList.restoreSavedFocusedItems();
    }

    this.isTasksListHotkeysEnabled = true;
    this.isTasksListFocusSaved = false;
  };

  handleFocusConfigurationFocus = () => {
    this.isTasksListHotkeysEnabled = false;
    this.isTasksListFocusSaved = true;
    this.listWithCreator.list.draggableList.saveFocusedItems();
    this.listWithCreator.list.draggableList.resetFocusedItem();
  };

  handleDragStart = () => {
    this.listWithCreator.list.draggableList.startDragging();
    this.weekList.draggableList.startDragging();
  };

  handleDragEnd = (result) => {
    if (result?.destination) {
      if (result.destination.droppableId === result.source.droppableId) {
        if (result.destination.droppableId === 'default') {
          this.listWithCreator.list.draggableList.endDragging(result);
          this.weekList.draggableList.endDragging();
        } else {
          this.weekList.draggableList.endDragging(result);
          this.listWithCreator.list.draggableList.endDragging();
        }
      } else {
        if (result.destination.droppableId === 'default') {
          this.listWithCreator.list.swapTasks(
            this.weekList,
            result.draggableId,
            result.destination.index
          );
        } else {
          this.weekList.swapTasks(
            this.listWithCreator.list,
            result.draggableId,
            result.destination.index
          );
        }

        this.listWithCreator.list.draggableList.endDragging();
        this.weekList.draggableList.endDragging();
      }
    }
  };

  get sensors() {
    return [
      (api) => {
        console.log(api);
        this.listWithCreator.list.draggableList.setDnDApi(api);
        this.weekList.draggableList.setDnDApi(api);
      },
    ];
  }

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

  taskCallbacks: TaskProps['callbacks'] = {
    ...this.listWithCreator.list.taskCallbacks,
    onExpand: this.handleExpandTask,
    onCollapse: this.handleCollapseTask,
  };

  tasksListCallbacks: TasksListProps['callbacks'] = {
    onInit: this.setShouldSetFirstFocus,
    onFocusLeave: this.handleTasksListFocusLeave,
    onCloseTask: this.handleCollapseTask,
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
