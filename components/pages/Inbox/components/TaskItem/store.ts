import { makeAutoObservable } from 'mobx';
import { NavigationDirections, TaskData, TaskStatus, TaskTag } from '../../store/types';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import React, { MouseEvent } from 'react';
import { TaskQuickEditorStore } from '../TaskQuickEditor/store';

export type TaskItemProps = {
  task?: TaskData | null,
  isFocused?: boolean
  isDragging?: boolean
  isEditMode?: boolean
  onFocus?: (taskId: string, multiselect?: 'single' | 'many') => void
  onNavigate?: (direction: NavigationDirections) => void
  onStatusChange?: (taskId: string, status: TaskStatus) => void
  tagsMap: Record<string, TaskTag>
}

class TaskItemStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  quickEdit: TaskQuickEditorStore = new TaskQuickEditorStore(this.root);

  task: TaskData;
  tags: Record<string, TaskTag>;
  isFocused: boolean = false;
  isEditMode: boolean = false;
  isDragging: boolean = false;
  onFocus: TaskItemProps['onFocus'];
  onNavigate: TaskItemProps['onNavigate'];
  onStatusChange: TaskItemProps['onStatusChange'];

  handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (this.onFocus) {
      e.preventDefault();
      this.onFocus(this.task.id, e.metaKey ? 'single' : e.shiftKey ? 'many' : undefined);
    }
  };

  handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked ? TaskStatus.DONE : TaskStatus.TODO;

    this.onStatusChange(this.task.id, newStatus);
    this.onFocus(null);
  };

  init = ({ task, isFocused, onFocus, onNavigate, onStatusChange, tagsMap, isDragging, isEditMode }: TaskItemProps) => {
    this.task = task;
    this.isFocused = isFocused;
    this.onFocus = onFocus;
    this.tags = tagsMap;
    this.isDragging = isDragging;
    this.onStatusChange = onStatusChange;
    this.onNavigate = onNavigate;

    this.isEditMode = isEditMode;
  };
}

export const {
  StoreProvider: TaskItemStoreProvider,
  useStore: useTaskItemStore,
} = getProvider(TaskItemStore);