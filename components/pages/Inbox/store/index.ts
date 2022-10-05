import { RootStore } from '../../../../stores/RootStore';
import { makeAutoObservable, runInAction } from 'mobx';
import { getProvider } from '../../../../helpers/StoreProvider';
import { TaskData, TaskTag } from './types';
import React from 'react';

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

  items: TaskData[] = [];
  tags: TaskTag[] = [];
  tagsMap: Record<string, TaskTag> = {};
  focusedTask: null | TaskData = null;
  openedTask: null | TaskData = null;

  openTask = (item: TaskData) => {
    this.openedTask = item;
  };

  closeTask = () => {
    this.openedTask = null;
  };

  createTask = (task: TaskData) => {
    this.items.push(task);
    this.root.api.tasks.create(task);
  };

  createTag = (tag: TaskTag) => {
    this.tags.push(tag);
    this.tagsMap[tag.id] = tag;
    this.root.api.tags.create(tag);
  }

  onOrderChange = (result) => {
    if (!result.destination) {
      return;
    }

    const [removed] = this.items.splice(result.source.index, 1);
    this.items.splice(result.destination.index, 0, removed);

    this.root.api.tasks.order({ id: removed.id, index: result.destination.index });
  };

  handleTaskKeyDown = (task: TaskData) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const index = this.items.findIndex((item) => item.id === task.id);

      if (index !== this.items.length - 1) {
        this.setFocusedTask(this.items[index + 1]);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const index = this.items.findIndex((item) => item.id === task.id);

      if (index !== 0) {
        this.setFocusedTask(this.items[index - 1]);
      }
    }
  };

  handleTaskFocus = (task: TaskData) => () => {
    this.setFocusedTask(task);
  };

  setFocusedTask = (task: TaskData) => {
    this.focusedTask = task;
  };

  loadTasks = async () => {
    this.items = await this.root.api.tasks.getList();
  }

  loadTags = async () => {
    const tags = await this.root.api.tags.get();

    runInAction(() => {
      this.tags = tags;
      this.tagsMap = tags.reduce((acc, tag) => {
        acc[tag.id] = tag;
        return acc;
      }, {});
    })
  }

  load = async () => {
    this.loadTasks();
    this.loadTags()
  };

  init = async () => {
    await this.load();
  };
}

export const {
  useStore: useTasksStore,
  StoreProvider: TasksStoreProvider,
} = getProvider(TasksStore);