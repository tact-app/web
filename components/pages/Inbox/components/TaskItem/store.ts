import { makeAutoObservable } from 'mobx';
import { TaskData, TaskStatus, TaskTag } from '../../store/types';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import React from 'react';

export type TaskItemProps = {
  task: TaskData,
  isFocused?: boolean
  onFocus?: (task: TaskData) => void
  tags: Record<string, TaskTag>
}

class TaskItemStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  task: TaskData;
  tags: Record<string, TaskTag>;
  isFocused: boolean = false;
  onFocus: TaskItemProps['onFocus'];

  focus = () => {
    if (this.onFocus) {
      this.onFocus(this.task);
    }
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

  };

  handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked ? TaskStatus.DONE : TaskStatus.TODO
    this.task.status = newStatus;

    this.root.api.tasks.status({
      id: this.task.id,
      status: newStatus
    });
  };

  init = ({ task, isFocused, onFocus, tags }: TaskItemProps) => {
    this.task = task;
    this.isFocused = isFocused;
    this.onFocus = onFocus;
    this.tags = tags;
  };
}

export const {
  StoreProvider: TaskItemStoreProvider,
  useStore: useTaskItemStore,
} = getProvider(TaskItemStore);