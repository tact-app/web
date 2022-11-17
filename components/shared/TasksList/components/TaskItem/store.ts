import { makeAutoObservable } from 'mobx';
import { TaskData, TaskStatus, TaskTag } from '../../types';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import React, { MouseEvent, FocusEvent } from 'react';
import { TaskQuickEditorStore } from '../TaskQuickEditor/store';

export type TaskItemProps = {
  task?: TaskData | null;
  highlightActiveTasks?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isFocused?: boolean;
  isDragging?: boolean;
  isEditMode?: boolean;
  onFocus?: (taskId: string, multiselect?: 'single' | 'many') => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  tagsMap: Record<string, TaskTag>;
};

class TaskItemStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  quickEdit: TaskQuickEditorStore = new TaskQuickEditorStore(this.root);

  boxRef: HTMLDivElement | null = null;

  task: TaskData;
  tags: Record<string, TaskTag>;
  isDisabled: boolean = false;
  isFocused: boolean = false;
  isEditMode: boolean = false;
  isDragging: boolean = false;
  isReadOnly: boolean = false;
  skipClick: boolean = false;
  onFocus: TaskItemProps['onFocus'];
  onStatusChange: TaskItemProps['onStatusChange'];

  setBoxRef = (ref: HTMLDivElement | null) => {
    this.boxRef = ref;
  };

  handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (
      this.onFocus &&
      !this.isDisabled &&
      !this.isEditMode &&
      !this.isReadOnly &&
      !this.skipClick
    ) {
      e.preventDefault();
      document.getSelection().removeAllRanges();

      this.onFocus(
        this.task.id,
        e.metaKey ? 'single' : e.shiftKey ? 'many' : undefined
      );
    }

    this.skipClick = false;
  };

  handleFocus = (e: FocusEvent) => {
    if (!this.isFocused) {
      this.skipClick = true;
      this.onFocus(this.task.id);
    }
  };

  handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked ? TaskStatus.DONE : TaskStatus.TODO;

    this.onStatusChange(this.task.id, newStatus);
    this.onFocus(null);
  };

  update = ({
    task,
    onFocus,
    onStatusChange,
    tagsMap,
    isFocused,
    isDisabled,
    isDragging,
    isReadOnly,
    isEditMode,
  }: TaskItemProps) => {
    const prevIsFocused = this.isFocused;
    this.isFocused = isFocused;

    if (isFocused !== prevIsFocused && isFocused) {
      this.boxRef?.focus();
    }

    this.task = task;
    this.onFocus = onFocus;
    this.tags = tagsMap;
    this.onStatusChange = onStatusChange;

    this.isDisabled = isDisabled;
    this.isDragging = isDragging;
    this.isEditMode = isEditMode;
    this.isReadOnly = isReadOnly;
  };
}

export const {
  StoreProvider: TaskItemStoreProvider,
  useStore: useTaskItemStore,
} = getProvider(TaskItemStore);
