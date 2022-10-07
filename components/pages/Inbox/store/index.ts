import { RootStore } from '../../../../stores/RootStore';
import { makeAutoObservable, runInAction } from 'mobx';
import { getProvider } from '../../../../helpers/StoreProvider';
import { NavigationDirections, TaskData, TaskStatus, TaskTag } from './types';
import { ModalsController } from '../../../../helpers/ModalsController';
import { TaskDeleteModal } from '../components/Modals/TaskDeleteModal';
import { TaskQuickEditorStore } from '../components/TaskQuickEditor/store';

export enum ModalsTypes {
  DELETE_TASK,
  WONTDO_TASK,
}

class TasksStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  creator = new TaskQuickEditorStore(this.root);
  modals = new ModalsController({
    [ModalsTypes.DELETE_TASK]: TaskDeleteModal,
  });

  listId: string = 'default';
  items: Record<string, TaskData> = {};
  order: string[] = [];
  tags: TaskTag[] = [];
  tagsMap: Record<string, TaskTag> = {};
  focusedTaskIds: string[] = [];
  editingTaskId: null | string = null;
  openedTask: null | TaskData = null;

  isItemMenuOpen: boolean = false;
  isDraggingActive: boolean = false;
  isControlDraggingActive: boolean = false;
  DnDApi = null;
  dropTimeout: null | number = null;
  currentSelectTaskCursor: number = 0;

  getHandler = (fn: (e) => void) => (e) => {
    if (!this.isItemMenuOpen && !this.isDraggingActive && !this.isControlDraggingActive) {
      fn(e);
    }
  };

  hotkeyHandlers = {
    UP: this.getHandler(() => this.handleNavigation(NavigationDirections.UP)),
    DOWN: this.getHandler(() => this.handleNavigation(NavigationDirections.DOWN)),
    DONE: this.getHandler(() => {
      if (this.focusedTaskIds.length) {
        this.setTasksStatus(this.focusedTaskIds, TaskStatus.DONE);
      }
    }),
    WONT_DO: this.getHandler(() => {
      if (this.focusedTaskIds.length) {
        this.setTasksStatus(this.focusedTaskIds, TaskStatus.WONT_DO);
      }
    }),
    DELETE: this.getHandler(() => {
      if (this.focusedTaskIds.length) {
        const tasksForDelete = this.focusedTaskIds.slice();

        this.modals.open({
          type: ModalsTypes.DELETE_TASK,
          props: {
            onDelete: () => {
              this.deleteTasks(tasksForDelete);
              this.modals.close();
            },
            onClose: this.modals.close,
          }
        });
      }
    }),
    FORCE_DELETE: this.getHandler(() => {
      if (this.focusedTaskIds.length) {
        this.deleteTasks(this.focusedTaskIds);
      }
    }),
    EDIT: this.getHandler((e) => {
      e.preventDefault();
      if (this.focusedTaskIds.length) {
        this.setEditingTask(this.focusedTaskIds[this.focusedTaskIds.length - 1]);
      }
    }),
    MOVE_UP: this.getHandler(() => {
      if (this.focusedTaskIds.length) {
        if (this.focusedTaskIds.length === 1) {
          this.runControlsMoveAction((lift) => lift.moveUp());
        } else {
          this.controlsMultiMoveAction('up');
        }
      }
    }),
    MOVE_DOWN: this.getHandler(() => {
      if (this.focusedTaskIds.length) {
        if (this.focusedTaskIds.length === 1) {
          this.runControlsMoveAction((lift) => lift.moveDown());
        } else {
          this.controlsMultiMoveAction('down');
        }
      }
    }),
    SELECT_UP: this.getHandler(() => this.shiftSelect('up')),
    SELECT_DOWN: this.getHandler(() => this.shiftSelect('down')),
    ESC: this.getHandler(() => {
      this.resetFocusedTask();
    }),
  };

  ignoreEventsCondition = () => {
    return this.isItemMenuOpen;
  };

  openItemMenu = () => {
    this.isItemMenuOpen = true;
  };

  closeItemMenu = () => {
    this.isItemMenuOpen = false;
  };

  shiftSelect = (direction: 'up' | 'down', count: number = 1) => {
    if (this.focusedTaskIds.length) {
      const isUp = direction === 'up';

      if (isUp ? this.currentSelectTaskCursor >= 0 : this.currentSelectTaskCursor <= 0) {
        const focusedTaskIndex = this.order.indexOf(this.focusedTaskIds[isUp ? 0 : this.focusedTaskIds.length - 1]);
        const nextFocusedTaskIds = this.order.slice(
          focusedTaskIndex + (isUp ? -count : 1),
          focusedTaskIndex + (isUp ? 0 : count + 1)
        );

        if (nextFocusedTaskIds.length) {
          this.currentSelectTaskCursor += isUp ? 1 : -1;

          this.addFocusedTasks(nextFocusedTaskIds);
        }
      } else {
        if (this.currentSelectTaskCursor > 0) {
          this.currentSelectTaskCursor -= count;
          this.focusedTaskIds = this.focusedTaskIds.slice(count);
        } else {
          this.currentSelectTaskCursor += count;
          this.focusedTaskIds = this.focusedTaskIds.slice(0, -count);
        }
      }
    }
  };

  runControlsMoveAction = (action: (lift) => void) => {
    if (this.isDraggingActive || this.isControlDraggingActive || this.dropTimeout) {
      return null;
    }

    const preDrag = this.DnDApi.tryGetLock(this.focusedTaskIds[0], () => {
    });

    this.isControlDraggingActive = true;

    const lift = preDrag.snapLift();

    action(lift);

    this.dropTimeout = setTimeout(() => {
      lift.drop();
      this.dropTimeout = null;
    }, 200) as unknown as number;
  };

  controlsMultiMoveAction = (direction: 'up' | 'down') => {
    const mainSelectedTaskId = this.focusedTaskIds[0];
    const destinationIndex = this.order.indexOf(mainSelectedTaskId) + (direction === 'up' ? -1 : 1);

    this.order = this.order.filter((id) => !this.focusedTaskIds.includes(id));
    this.order.splice(destinationIndex, 0, ...this.focusedTaskIds);

    this.root.api.tasks.order({
      listId: this.listId,
      taskIds: this.focusedTaskIds,
      destination: destinationIndex,
    });
  };

  openTask = (item: TaskData) => {
    this.openedTask = item;
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

    this.order = this.order.filter((id) => !ids.includes(id));

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

  setDnDApi = (api) => {
    this.DnDApi = api;
  };

  startDragging = () => {
    this.isDraggingActive = true;
  };

  endDragging = (result) => {
    this.isDraggingActive = false;
    this.isControlDraggingActive = false;

    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const [removed] = this.order.splice(result.source.index, 1);
    this.order.splice(result.destination.index, 0, removed);

    this.root.api.tasks.order({
      listId: this.listId,
      taskIds: [removed],
      destination: result.destination.index,
    });
  };

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

  handleNavigation = (direction: NavigationDirections) => {
    const focusedTaskIndex = direction === NavigationDirections.UP ? 0 : this.focusedTaskIds.length - 1;
    const index = this.focusedTaskIds.length ? this.order.indexOf(this.focusedTaskIds[focusedTaskIndex]) : -1;

    this.resetFocusedTask();

    if (index !== -1) {
      if (direction === NavigationDirections.UP) {
        if (index !== 0) {
          this.setFocusedTask(this.order[index - 1]);
        } else {
          this.creator.setFocus(true);
        }
      } else if (direction === NavigationDirections.DOWN) {
        if (index !== this.order.length - 1) {
          this.setFocusedTask(this.order[index + 1]);
        } else {
          this.creator.setFocus(true);
        }
      }
    } else {
      if (direction === NavigationDirections.DOWN) {
        this.setFocusedTask(this.order[0]);
      } else {
        this.setFocusedTask(this.order[this.order.length - 1]);
      }
    }
  };

  resetFocusedTask = () => {
    this.focusedTaskIds = [];
    this.currentSelectTaskCursor = 0;
  };

  focusFirstTask = () => {
    this.setFocusedTask(this.order[0]);
  };

  setFocusedTask = (id: string, multiselect?: 'single' | 'many') => {
    if (this.focusedTaskIds.length === 1 && this.focusedTaskIds[0] === id && this.items[id].status === TaskStatus.TODO) {
      this.setEditingTask(id);
    } else if (!multiselect) {
      this.resetFocusedTask();
      this.addFocusedTasks([id]);
    } else if (multiselect === 'single') {
      if (this.focusedTaskIds.includes(id)) {
        this.focusedTaskIds = this.focusedTaskIds.filter((taskId) => taskId !== id);

        if (this.currentSelectTaskCursor !== 0) {
          if (this.currentSelectTaskCursor > 0) {
            this.currentSelectTaskCursor--;
          } else {
            this.currentSelectTaskCursor++;
          }
        }
      } else {
        this.addFocusedTasks([id]);

        if (this.currentSelectTaskCursor !== 0) {
          if (this.currentSelectTaskCursor < 0) {
            this.currentSelectTaskCursor--;
          } else {
            this.currentSelectTaskCursor++;
          }
        }
      }
    } else if (multiselect === 'many' && this.focusedTaskIds.length && !this.focusedTaskIds.includes(id)) {
      const topFocusedTaskIndex = this.order.indexOf(this.focusedTaskIds[0]);
      const bottomFocusedTaskIndex = this.order.indexOf(this.focusedTaskIds[this.focusedTaskIds.length - 1]);
      const index = this.order.indexOf(id);

      if (index > bottomFocusedTaskIndex) {
        this.shiftSelect('down', index - bottomFocusedTaskIndex);
      } else if (index < topFocusedTaskIndex) {
        this.shiftSelect('up', topFocusedTaskIndex - index);
      }
    }
  };

  addFocusedTasks = (taskIds: string[]) => {
    this.focusedTaskIds.push(...taskIds);
    this.focusedTaskIds.sort((a, b) => this.order.indexOf(a) - this.order.indexOf(b));

    this.setEditingTask(null);
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