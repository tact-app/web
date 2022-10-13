import { RootStore } from '../../../stores/RootStore';
import { makeAutoObservable, runInAction } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { NavigationDirections, TaskData, TaskStatus, TaskTag } from './types';
import { ModalsController } from '../../../helpers/ModalsController';
import { TaskDeleteModal } from './modals/TaskDeleteModal';
import { TaskQuickEditorStore } from './components/TaskQuickEditor/store';
import { DraggableListCallbacks, DraggableListStore } from '../../shared/DraggableList/store';

export enum ModalsTypes {
  DELETE_TASK,
  WONTDO_TASK,
}

class TasksStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  draggableList = new DraggableListStore(this.root);
  creator = new TaskQuickEditorStore(this.root);
  modals = new ModalsController({
    [ModalsTypes.DELETE_TASK]: TaskDeleteModal,
  });

  listId: string = 'default';
  items: Record<string, TaskData> = {};
  order: string[] = [];
  tags: TaskTag[] = [];
  tagsMap: Record<string, TaskTag> = {};
  editingTaskId: null | string = null;
  openedTask: null | string = null;

  isItemMenuOpen: boolean = false;

  getHandler = (fn: (e) => void) => (e) => {
    if (!this.isItemMenuOpen && !this.draggableList.isDraggingActive && !this.draggableList.isControlDraggingActive) {
      fn(e);
    }
  };

  hotkeyHandlers = {
    DONE: this.getHandler(() => {
      if (this.draggableList.focused.length) {
        this.setTasksStatus(this.draggableList.focused, TaskStatus.DONE);
      }
    }),
    WONT_DO: this.getHandler(() => {
      if (this.draggableList.focused.length) {
        this.setTasksStatus(this.draggableList.focused, TaskStatus.WONT_DO);
      }
    }),
    EDIT: this.getHandler((e) => {
      e.preventDefault();
      if (this.draggableList.focused.length === 1) {
        this.setEditingTask(this.draggableList.focused[this.draggableList.focused.length - 1]);
      }
    }),
    OPEN: this.getHandler(() => {
      if (this.draggableList.focused.length) {
        this.openTask(this.draggableList.focused[0]);
      }
    })
  };

  draggableHandlers: DraggableListCallbacks = {
    onItemsRemove: (order: string[], ids: string[]) => {
      this.order = order;
      this.deleteTasks(ids);
    },
    onFocusLeave: () => {
      this.creator.setFocus(true);
    },
    onItemSecondClick: (id: string) => {
      this.setEditingTask(id);
    },
    onFocusedItemsChange: (ids: string[]) => {
      if (ids.length !== 1) {
        this.setEditingTask(null);
      } else {
        if (this.editingTaskId) {
          this.setEditingTask(ids[0]);
        }

        if (this.openedTask) {
          this.openTask(ids[0]);
        }
      }
    },
    onOrderChange: (order: string[], changedIds: string[], destinationIndex: number) => {
      this.changeOrder(order, changedIds, destinationIndex);
    },
    onVerifyDelete: (ids: string[], done: () => void) => {
      this.modals.open({
        type: ModalsTypes.DELETE_TASK,
        props: {
          onDelete: () => {
            this.deleteTasks(ids);
            this.modals.close();
            done();
          },
          onClose: this.modals.close,
        }
      });
    },
    onEscape: () => {
      if (this.openedTask) {
        this.openedTask = null;

        return false
      }

      return true;
    }
  }

  get openedTaskData() {
    return this.items[this.openedTask];
  }

  openItemMenu = () => {
    this.isItemMenuOpen = true;
  };

  closeItemMenu = () => {
    this.isItemMenuOpen = false;
  };

  openTask = (taskId: string) => {
    this.openedTask = taskId;
  };

  closeTask = () => {
    this.openedTask = null;
  };

  createTask = (task: TaskData) => {
    this.items[task.id] = task;
    this.order.push(task.id);

    this.root.api.tasks.create(task);
  };

  deleteTasks = (ids: string[]) => {
    ids.forEach((id) => {
      delete this.items[id];
    });

    this.root.api.tasks.delete(this.listId, ids);
  };

  updateTask = (task: TaskData) => {
    Object.assign(this.items[task.id], task);

    this.root.api.tasks.update({ id: task.id, fields: task });
  };

  createTag = (tag: TaskTag) => {
    this.tags.push(tag);
    this.tagsMap[tag.id] = tag;
    this.root.api.tags.create(tag);
  };

  changeOrder = (order: string[], changedItemIds: string[], destinationIndex: number) => {
    this.order = order;

    this.root.api.tasks.order({
      listId: this.listId,
      taskIds: changedItemIds,
      destination: destinationIndex,
    });
  }

  setTasksStatus = (ids: string[], status: TaskStatus) => {
    ids.forEach((id) => {
      this.setTaskStatus(id, status);
    });
  };

  setTaskStatus = (taskId: string, status: TaskStatus) => {
    const task = this.items[taskId];

    if (task.status === TaskStatus.TODO) {
      task.status = status;

      this.root.api.tasks.update({
        id: task.id,
        fields: { status }
      });
    }
  };

  setEditingTask = (taskId: string | null) => {
    this.editingTaskId = taskId;
  };

  loadTasks = async () => {
    const { tasks, order } = await this.root.api.tasks.getList(this.listId);

    runInAction(() => {
      this.items = tasks;
      this.order = order;
    });
  };

  loadTags = async () => {
    const tags = await this.root.api.tags.get();

    runInAction(() => {
      this.tags = tags;
      this.tagsMap = tags.reduce((acc, tag) => {
        acc[tag.id] = tag;
        return acc;
      }, {});
    });
  };

  load = async () => {
    this.loadTasks();
    this.loadTags();
  };

  init = async () => {
    await this.load();
  };
}

export const {
  useStore: useTasksStore,
  StoreProvider: TasksStoreProvider,
} = getProvider(TasksStore);
