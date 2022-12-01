import { makeAutoObservable } from 'mobx';
import {
  TaskQuickEditorProps,
  TaskQuickEditorStore,
} from '../TasksList/components/TaskQuickEditor/store';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';
import { TasksListProps, TasksListStore } from '../TasksList/store';
import { NavigationDirections } from '../TasksList/types';

export type TasksListWithCreatorProps = TasksListProps;

export class TasksListWithCreatorStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  creator = new TaskQuickEditorStore(this.root);
  list = new TasksListStore(this.root);

  keyMap = {
    FOCUS: 'n',
  };

  hotkeyHandlers = {
    FOCUS: () => {
      this.list.removeFocus();
      this.creator.setFocus(true);
    },
  };

  callbacks: TasksListWithCreatorProps['callbacks'] = {};

  get isHotkeysEnabled() {
    return this.list.isHotkeysEnabled && !this.creator.isMenuOpen;
  }

  get tasksListCallbacks(): TasksListProps['callbacks'] {
    return {
      ...this.callbacks,
      onReset: () => {
        this.creator.reset();
      },
      onFocusLeave: (direction) => {
        if (
          direction === NavigationDirections.UP ||
          direction === NavigationDirections.DOWN
        ) {
          this.creator.setFocus(true);

          return true;
        } else {
          return this.callbacks.onFocusLeave?.(direction);
        }
      },
      onEmpty: () => {
        this.creator.setFocus(true);
      },
    };
  }

  reset = () => {
    this.creator.reset();
    this.list.reset();
  };

  update = (props: TasksListWithCreatorProps) => {
    this.callbacks = props.callbacks;
  };

  taskCreatorCallbacks: TaskQuickEditorProps['callbacks'] = {
    onSave: this.list.createTask,
    onForceSave: (taskId: string) => {
      this.list.openTask(taskId, true);
      this.list.draggableList.setFocusedItem(taskId);
    },
    onNavigate: this.list.handleNavigation,
    onFocus: this.list.removeFocus,
  };
}

export const {
  StoreProvider: TasksListWithCreatorStoreProvider,
  useStore: useTasksListWithCreatorStore,
} = getProvider(TasksListWithCreatorStore);
