import { makeAutoObservable } from 'mobx';
import { TaskData, TaskStatus, TaskTag } from '../../types';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import React, { MouseEvent } from 'react';
import { TaskQuickEditorStore } from '../TaskQuickEditor/store';
import { ListNavigation } from '../../../../../helpers/ListNavigation';

export type TaskItemProps = {
  task?: TaskData | null;
  highlightActiveTasks?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isFocused?: boolean;
  isDragging?: boolean;
  isEditMode?: boolean;
  isMultiselect?: boolean;

  onToggleMenu?: (isOpen: boolean) => void;
  onFocus?: (taskId: string, multiselect?: 'single' | 'many') => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onWontDoWithComment?: (taskId: string) => void;
  tagsMap: Record<string, TaskTag>;
};

class TaskItemStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  menuNavigation = new ListNavigation();
  quickEdit: TaskQuickEditorStore = new TaskQuickEditorStore(this.root);

  boxRef: HTMLDivElement | null = null;

  task: TaskData;
  tags: Record<string, TaskTag>;

  isMenuOpen: boolean = false;
  isMouseDown: boolean = false;
  isDisabled: boolean = false;
  isFocused: boolean = false;
  isEditMode: boolean = false;
  isDragging: boolean = false;
  isReadOnly: boolean = false;
  isMultiselect: boolean = false;

  onFocus: TaskItemProps['onFocus'];
  onStatusChange: TaskItemProps['onStatusChange'];
  onToggleMenu: TaskItemProps['onToggleMenu'];
  onWontDoWithComment: TaskItemProps['onWontDoWithComment'];

  setHotkeysHandlers = () => {
    let isAltPressed = false;

    const keyDownListener = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        isAltPressed = true;
      } else if (isAltPressed) {
        isAltPressed = false;
      }
    };

    const keyUpListener = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        if (isAltPressed) {
          this.toggleMenu();
        }

        isAltPressed = false;
      }
    };

    document.addEventListener('keydown', keyDownListener);
    document.addEventListener('keyup', keyUpListener);

    return () => {
      document.removeEventListener('keydown', keyDownListener);
      document.removeEventListener('keyup', keyUpListener);
    };
  };

  setBoxRef = (ref: HTMLDivElement | null) => {
    this.boxRef = ref;
  };

  toggleMenu = () => {
    this.isMenuOpen = !this.isMenuOpen;
    this.onToggleMenu(this.isMenuOpen);
  };

  openMenu = () => {
    this.isMenuOpen = true;
    this.onToggleMenu(true);
  };

  closeMenu = () => {
    this.isMenuOpen = false;
    this.onToggleMenu(false);
  };

  handleMouseDown = () => {
    this.isMouseDown = true;
  };

  handleMouseUp = () => {
    this.isMouseDown = false;
  };

  handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (
      this.onFocus &&
      !this.isDisabled &&
      !this.isEditMode &&
      !this.isReadOnly
    ) {
      e.preventDefault();
      document.getSelection().removeAllRanges();

      this.onFocus(
        this.task.id,
        e.metaKey ? 'single' : e.shiftKey ? 'many' : undefined
      );
    }
  };

  handleFocus = () => {
    if (!this.isFocused && !this.isMouseDown) {
      this.onFocus(this.task.id);
    }
  };

  handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nativeEvent = e.nativeEvent as PointerEvent;
    let newStatus;

    if (this.task.status === TaskStatus.TODO) {
      if (nativeEvent.metaKey || nativeEvent.ctrlKey) {
        newStatus = TaskStatus.WONT_DO;

        if (nativeEvent.shiftKey) {
          this.onWontDoWithComment(this.task.id);
          return;
        }
      } else {
        newStatus = TaskStatus.DONE;
      }
    } else {
      if (nativeEvent.metaKey || nativeEvent.ctrlKey) {
        if (this.task.status === TaskStatus.DONE) {
          newStatus = TaskStatus.WONT_DO;

          if (nativeEvent.shiftKey) {
            this.onWontDoWithComment(this.task.id);
            return;
          }
        } else {
          newStatus = TaskStatus.TODO;
        }
      } else {
        newStatus = TaskStatus.DONE;
      }
    }

    this.onStatusChange(this.task.id, newStatus);
  };

  update = ({
    task,
    onFocus,
    onStatusChange,
    onWontDoWithComment,
    onToggleMenu,
    tagsMap,
    isFocused,
    isDisabled,
    isDragging,
    isReadOnly,
    isEditMode,
    isMultiselect,
  }: TaskItemProps) => {
    const prevIsFocused = this.isFocused;
    this.isFocused = isFocused;

    if (isFocused !== prevIsFocused && isFocused) {
      this.boxRef?.focus();
    }

    this.task = task;
    this.tags = tagsMap;

    this.onFocus = onFocus;
    this.onStatusChange = onStatusChange;
    this.onWontDoWithComment = onWontDoWithComment;
    this.onToggleMenu = onToggleMenu;

    this.isDisabled = isDisabled;
    this.isDragging = isDragging;
    this.isEditMode = isEditMode;
    this.isReadOnly = isReadOnly;
    this.isMultiselect = isMultiselect;
  };
}

export const {
  StoreProvider: TaskItemStoreProvider,
  useStore: useTaskItemStore,
} = getProvider(TaskItemStore);
