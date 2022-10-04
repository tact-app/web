import { RootStore } from '../../../../stores/RootStore';
import { makeAutoObservable, runInAction } from 'mobx';
import { getProvider } from '../../../../helpers/StoreProvider';
import { TaskData } from './types';
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
  }

  onOrderChange = (result) => {
    if (!result.destination) {
      return;
    }

    const [removed] = this.items.splice(result.source.index, 1);
    this.items.splice(result.destination.index, 0, removed);
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

  load = async () => {
    this.items = await this.root.api.tasks.getList();
  };

  init = async () => {
    await this.load();
  };
}

export const {
  useStore: useTasksStore,
  StoreProvider: TasksStoreProvider,
} = getProvider(TasksStore);