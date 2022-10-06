import { RootStore } from '../../../../stores/RootStore';
import { makeAutoObservable, runInAction } from 'mobx';
import { getProvider } from '../../../../helpers/StoreProvider';
import { NavigationDirections, TaskData, TaskStatus, TaskTag } from './types';
import React, { RefObject } from 'react';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class TasksStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  listId: string = 'default';
  items: Record<string, TaskData> = {};
  order: string[] = [];
  tags: TaskTag[] = [];
  tagsMap: Record<string, TaskTag> = {};
  focusedTaskIds: string[] = [];
  editingTaskId: null | string = null;
  openedTask: null | TaskData = null;

  isDraggingActive: boolean = false;
  isControlDraggingActive: boolean = false;
  DnDApi = null;
  dropTimeout: null | number = null;
  currentSelectTaskCursor: number = 0;

  hotkeyHandlers = {
    UP: () => this.handleNavigation(NavigationDirections.UP),
    DOWN: () => this.handleNavigation(NavigationDirections.DOWN),
    DONE: () => {
      if (this.focusedTaskIds.length) {
        this.setTasksStatus(this.focusedTaskIds, TaskStatus.DONE);
      }
    },
    EDIT: (e) => {
      e.preventDefault();
      if (this.focusedTaskIds.length) {
        this.setEditingTask(this.focusedTaskIds[this.focusedTaskIds.length - 1]);
      }
    },
    MOVE_UP: () => {
      if (this.focusedTaskIds.length === 1) {
        this.runControlsMoveAction((lift) => lift.moveUp())
      }
    },
    MOVE_DOWN: () => {
      if (this.focusedTaskIds.length === 1) {
        this.runControlsMoveAction((lift) => lift.moveDown())
      }
    },
    SELECT_UP: () => this.shiftSelect('up'),
    SELECT_DOWN: () => this.shiftSelect('down'),
  };

  shiftSelect = (direction: 'up' | 'down') => {
    if (this.focusedTaskIds.length) {
      const isUp = direction === 'up';

      if (isUp ? this.currentSelectTaskCursor >= 0 : this.currentSelectTaskCursor <= 0) {
        const focusedTaskIndex = this.order.indexOf(this.focusedTaskIds[this.focusedTaskIds.length - 1]);
        const nextFocusedTaskId = this.order[focusedTaskIndex + (isUp ? -1 : 1)];
        const alreadyFocusedTaskIndex = this.focusedTaskIds.indexOf(nextFocusedTaskId);

        if (alreadyFocusedTaskIndex !== -1) {
          this.focusedTaskIds.splice(alreadyFocusedTaskIndex, 1);
        }

        if (nextFocusedTaskId) {
          this.currentSelectTaskCursor += isUp ? 1 : -1;

          this.addFocusedTask(nextFocusedTaskId)
        }
      } else {
        this.focusedTaskIds.pop();

        if (this.currentSelectTaskCursor > 0) {
          this.currentSelectTaskCursor--;
        } else {
          this.currentSelectTaskCursor++;
        }
      }
    }
  }

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
  }

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
      destination: result.destination.index,
      source: result.source.index
    });
  };

  setTasksStatus = (ids: string[], status: TaskStatus) => {
    ids.forEach((id) => {
      this.setTaskStatus(id, status);
    });
  }

  setTaskStatus = (taskId: string, status: TaskStatus) => {
    const task = this.items[taskId];

    task.status = status;

    this.root.api.tasks.update({
      id: task.id,
      fields: { status }
    });
  };

  handleNavigation = (direction: NavigationDirections) => {
    const focusedTaskIndex = direction === NavigationDirections.UP ? 0 :this.focusedTaskIds.length - 1
    const index = this.focusedTaskIds.length ? this.order.indexOf(this.focusedTaskIds[focusedTaskIndex]) : -1;

    this.resetFocusedTask();

    if (index !== -1) {
      if (direction === NavigationDirections.UP && index !== 0) {
        this.setFocusedTask(this.order[index - 1]);
      } else if (direction === NavigationDirections.DOWN && index !== this.order.length - 1) {
        this.setFocusedTask(this.order[index + 1]);
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
  }

  focusFirstTask = () => {
    this.setFocusedTask(this.order[0]);
  };

  setFocusedTask = (id: string, multiselect?: boolean) => {
    if (!multiselect) {
      this.resetFocusedTask();
      this.addFocusedTask(id);
    } else {
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
        this.addFocusedTask(id);

        if (this.currentSelectTaskCursor !== 0) {
          if (this.currentSelectTaskCursor < 0) {
            this.currentSelectTaskCursor--;
          } else {
            this.currentSelectTaskCursor++;
          }
        }
      }
    }
  }

  addFocusedTask = (taskId: string | null) => {
    if (taskId === null) {
      this.resetFocusedTask();
    } else {
      this.focusedTaskIds.push(taskId);
    }

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