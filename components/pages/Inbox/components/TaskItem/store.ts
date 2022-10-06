import { makeAutoObservable } from 'mobx';
import { NavigationDirections, TaskData, TaskStatus, TaskTag } from '../../store/types';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import React, { SyntheticEvent } from 'react';

export type TaskItemProps = {
  task: TaskData,
  isFocused?: boolean
  isDragging?: boolean
  isEditMode?: boolean
  onFocus?: (taskId: string, multiselect?: boolean) => void
  onNavigate?: (direction: NavigationDirections) => void
  onStatusChange?: (taskId: string, status: TaskStatus) => void
  tags: Record<string, TaskTag>
}

class TaskItemStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  task: TaskData;
  tags: Record<string, TaskTag>;
  isFocused: boolean = false;
  isEditMode: boolean = false;
  isDragging: boolean = false;
  onFocus: TaskItemProps['onFocus'];
  onNavigate: TaskItemProps['onNavigate'];
  onStatusChange: TaskItemProps['onStatusChange'];

  isTitleChanges: boolean = false;

  handleClick = (e: MouseEvent) => {
    if (this.onFocus) {
      this.onFocus(this.task.id, e.metaKey);
    }
  };

  commitTitleChanges = () => {
    if (this.isTitleChanges) {
      this.root.api.tasks.update({ id: this.task.id, fields: { title: this.task.title } });
    }
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.commitTitleChanges();
    } else if (e.key === 'Escape') {
      this.commitTitleChanges();

      if (this.onFocus) {
        this.onFocus(null);
      }
    } else if ((e.key === 'Backspace' && !this.task.title) || e.key === 'Delete') {
      this.root.api.tasks.delete(this.task.id);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.commitTitleChanges();

      if (this.onNavigate) {
        this.onNavigate(e.key === 'ArrowDown' ? NavigationDirections.DOWN : NavigationDirections.UP);
      }
    } else if (e.key === 'd' && e.ctrlKey) {
      this.onStatusChange(this.task.id, TaskStatus.DONE);
    }
  };

  handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.task.title = e.target.value;
    this.isTitleChanges = true;
  };

  handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked ? TaskStatus.DONE : TaskStatus.TODO;

    this.onStatusChange(this.task.id, newStatus);
    this.onFocus(null);
  };

  init = ({ task, isFocused, onFocus, onNavigate, onStatusChange, tags, isDragging, isEditMode }: TaskItemProps) => {
    this.task = task;
    this.isFocused = isFocused;
    this.onFocus = onFocus;
    this.tags = tags;
    this.isDragging = isDragging;
    this.onStatusChange = onStatusChange;
    this.onNavigate = onNavigate;

    if (this.isEditMode && !isEditMode) {
      this.commitTitleChanges();
    }

    this.isEditMode = isEditMode;
  };
}

export const {
  StoreProvider: TaskItemStoreProvider,
  useStore: useTaskItemStore,
} = getProvider(TaskItemStore);