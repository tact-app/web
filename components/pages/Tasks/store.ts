import { RootStore } from '../../../stores/RootStore';
import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { FocusConfigurationData } from './components/FocusConfiguration/store';
import { FocusConfiguration } from './components/FocusConfiguration';
import {
  TaskData,
  TaskPriority,
  TaskStatus,
} from '../../shared/TasksList/types';
import { TasksListStore } from '../../shared/TasksList/store';

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

    if (this.isFocusModeActive) {
      if (task && task.status === TaskStatus.TODO) {
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
        return false;
      }
    } else {
      return true;
    }
  };

  toggleFocusMode = (silent?: boolean) => {
    if (!this.isFocusModeActive) {
      this.list.draggableList.resetFocusedItem();
    }

    const isOpen = !this.isFocusModeActive;
    this.isFocusModeActive = !this.isFocusModeActive;

    if (isOpen) {
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

  handleToggleFocusMode = () => {
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
}

export const { useStore: useTasksStore, StoreProvider: TasksStoreProvider } =
  getProvider(TasksStore);
