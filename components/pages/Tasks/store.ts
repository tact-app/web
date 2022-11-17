import { RootStore } from '../../../stores/RootStore';
import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { FocusConfigurationData } from './components/FocusConfiguration/store';
import { FocusConfiguration } from './components/FocusConfiguration';
import { TaskData, TaskPriority } from '../../shared/TasksList/types';
import { TasksListProps, TasksListStore } from '../../shared/TasksList/store';
import { TaskProps } from '../../shared/Task/store';

export class TasksStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  list = new TasksListStore(this.root);

  listId: string = 'default';
  focusModeConfiguration: FocusConfigurationData = {
    id: 'default',
    goals: [],
    showImportant: false,
  };

  isTaskExpanded: boolean = false;
  isFocusModeActive: boolean = false;
  isSilentFocusMode: boolean = false;

  keyMap = {
    FOCUS_MODE: 'f',
    SILENT_FOCUS_MODE: 'shift+f',
  };

  hotkeyHandlers = {
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
    return this.list.isHotkeysEnabled;
  }

  checkFocusModeMatch = (task: TaskData) => {
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

    if (isOpen) {
      this.list.draggableList.revalidateFocusedItems();

      const isOpenedTaskFocused = Boolean(
        this.list.openedTask &&
          this.checkFocusModeMatch(this.list.openedTaskData)
      );

      if (!isOpenedTaskFocused) {
        this.list.closeTask();
      }

      if (silent) {
        this.isSilentFocusMode = true;
        this.loadFocusModeConfiguration();
      } else {
        this.root.menu.setReplacer(FocusConfiguration, {
          goals: this.list.goals,
          getItemsCount: () => this.list.draggableList.activeItems.length,
          callbacks: {
            onChange: this.setFocusModeConfiguration,
            onClose: this.toggleFocusMode,
            onFocus: this.list.draggableList.resetFocusedItem,
            onBlur: this.list.draggableList.focusFirstItem,
            onGoalCreateClick: () => this.list.modals.openGoalCreationModal(),
          },
        });
      }
    } else {
      this.root.menu.resetReplacer();
    }

    this.isSilentFocusMode = false;
  };

  handleExpandTask = () => {
    this.isTaskExpanded = true;
  };

  handleCollapseTask = () => {
    this.isTaskExpanded = false;
  };

  handleToggleFocusMode = () => {
    // workaround for @zag-js/focus-visible library
    // it doesn't show focus on elements after mouse click
    document.dispatchEvent(new KeyboardEvent('keyup'));
    this.toggleFocusMode();
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

  setFirstFocus = () => {
    if (this.list.order.length) {
      this.list.draggableList.focusFirstItem();
    } else {
      this.list.creator.setFocus(true);
    }
  };

  taskCallbacks: TaskProps['callbacks'] = {
    ...this.list.taskCallbacks,
    onExpand: this.handleExpandTask,
    onCollapse: this.handleCollapseTask,
  };

  tasksListCallbacks: TasksListProps['callbacks'] = {
    onInit: this.setFirstFocus,
  };
}

export const { useStore: useTasksStore, StoreProvider: TasksStoreProvider } =
  getProvider(TasksStore);
