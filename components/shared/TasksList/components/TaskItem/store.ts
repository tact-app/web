import { makeAutoObservable, reaction } from 'mobx';
import { cloneDeep, isEqual } from 'lodash';
import { TaskData, TaskStatus } from '../../types';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import React, { MouseEvent } from 'react';
import { TaskQuickEditorProps, TaskQuickEditorStore } from '../../../TaskQuickEditor/store';
import { ListNavigation } from '../../../../../helpers/ListNavigation';
import { TasksListStore } from '../../store';
import { subscriptions } from '../../../../../helpers/subscriptions';
import { checkKeyCombination, checkKeyCombinations } from '../../../../../helpers/combinations';
import { isMac } from '../../../../../helpers/os';

const IGNORED_COMBINATIONS = ['Alt+D'];
export const TASK_TITLE_ELEMENT_ID = 'task-title';

export type TaskItemProps = {
  task?: TaskData | null;
  highlightActiveTasks?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isFocused?: boolean;
  isDragging?: boolean;
  isEditMode?: boolean;
  provided: any;
  disableSpaceChange?: boolean;
  disableGoalChange?: boolean;

  onToggleMenu?: (isOpen: boolean) => void;
  onFocus?: (taskId: string, multiselect?: 'single' | 'many') => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onWontDoWithComment?: (taskId: string) => void;
  callbacks: TaskQuickEditorProps['callbacks'];
};

export class TaskItemStore {
  constructor(public root: RootStore, public parent: TasksListStore) {
    makeAutoObservable(this);
  }

  menuNavigation = new ListNavigation();
  quickEdit: TaskQuickEditorStore = new TaskQuickEditorStore(this.root);

  boxRef: HTMLDivElement | null = null;

  task: TaskData;
  disableSpaceChange: boolean = false;
  disableGoalChange: boolean = false;

  hasListeners: boolean = false;
  isAltPressed: boolean = false;
  isMenuOpen: boolean = false;
  isMouseDown: boolean = false;
  isDragging: boolean = false;

  isOpenByContextMenu: boolean = false;
  xPosContextMenu: number;

  onFocus: TaskItemProps['onFocus'];
  onStatusChange: TaskItemProps['onStatusChange'];
  onToggleMenu: TaskItemProps['onToggleMenu'];
  onWontDoWithComment: TaskItemProps['onWontDoWithComment'];
  callbacks: TaskQuickEditorProps['callbacks'];

  get isMultiSelected() {
    return this.parent.draggableList.focused.length > 1;
  }

  get isOpened() {
    return this.task.id === this.parent.openedTask;
  }

  get isFocused() {
    return this.parent.draggableList.focused.includes(this.task.id);
  }

  get isPreFocused() {
    return this.parent.draggableList.savedFocusedItemIds.includes(this.task.id);
  }

  get isDisabled() {
    return !this.parent.checkTask(this.task.id);
  }

  get isReadOnly() {
    return this.parent.isReadOnly;
  }

  get isEditMode() {
    return (
      this.parent.editingTaskId && this.task.id === this.parent.editingTaskId
    );
  }

  handleKeyDown = (e: KeyboardEvent) => {
    const isAltPressed = checkKeyCombination(e, 'Alt');

    if (isAltPressed || checkKeyCombinations(e, IGNORED_COMBINATIONS)) {
      e.preventDefault();
    }

    if (isAltPressed !== this.isAltPressed) {
      this.isAltPressed = isAltPressed;
    }
  };

  handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Alt') {
      if (this.isAltPressed) {
        this.toggleMenu(!this.isMenuOpen);
      }

      this.isAltPressed = false;
    }
  };

  setKeyDownListeners = () => {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  };

  removeKeyDownListeners = () => {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  };

  setBoxRef = (ref: HTMLDivElement | null) => {
    this.boxRef = ref;
  };

  handleContextMenu = (e) => {
    e.preventDefault();
    if (!this.isMenuOpen) {
      !this.isFocused && this.onFocus(this.task.id);
      this.quickEdit.suggestionsMenu.close();
      this.quickEdit.suggestionsMenu.closeForMode();
      this.xPosContextMenu = e.pageX;
      this.toggleContextMenu(true);
      this.isMenuOpen = true;
      this.onToggleMenu(true);
    }
  }

  toggleContextMenu = (isContextMenu: boolean) => {
    this.isOpenByContextMenu = isContextMenu;
  };

  toggleMenu = (isOpen: boolean) => {
    this.isMenuOpen = isOpen;
    this.onToggleMenu(isOpen);

    if (isOpen) {
      this.handleFocus();
      this.quickEdit.suggestionsMenu.close();
      this.quickEdit.suggestionsMenu.closeForMode();
    } else {
      this.toggleContextMenu(false);
    }
  }

  handleMouseDown = () => {
    this.isMouseDown = true;
  };

  handleMouseUp = () => {
    this.isMouseDown = false;
  };

  handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.ctrlKey && e.type === 'click' && isMac()) {
      return
    }

    if ((e.detail !== 2 || this.isFocused) && (e.target as HTMLElement).id === TASK_TITLE_ELEMENT_ID) {
      return this.parent.setEditingTask(this.task.id);
    }

    if (
      this.onFocus &&
      !this.isDisabled &&
      !this.isReadOnly &&
      !this.isEditMode
    ) {
      e.preventDefault();

      this.onFocus(
        this.task.id,
        e.metaKey || e.ctrlKey ? 'single' : e.shiftKey ? 'many' : undefined
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
      if (nativeEvent.metaKey) {
        newStatus = TaskStatus.WONT_DO;

        if (nativeEvent.shiftKey) {
          this.onWontDoWithComment(this.task.id);
          return;
        }
      } else {
        newStatus = TaskStatus.DONE;
      }
    } else {
      if (nativeEvent.metaKey) {
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

  subscribe = () =>
    subscriptions(
      reaction(
        () => [this.isFocused, this.isMultiSelected],
        () => {
          if (this.isFocused && !this.isMultiSelected) {
            this.boxRef?.focus();
          }
        }
      ),
      reaction(
        () => [this.isFocused],
        async () => {
          const task = cloneDeep(this.task);

          try {
            const tags = this.quickEdit.modes.tag.tags.map((tag) => tag.id);

            if (
                !this.isFocused && (
                    task.title !== this.quickEdit.value ||
                    !isEqual(task.tags, tags) ||
                    task.priority !== this.quickEdit.modes.priority.priority
                )
            ) {
              this.task = {
                ...this.task,
                title: this.quickEdit.value,
                tags,
                priority: this.quickEdit.modes.priority.priority,
              };

              await this.callbacks.onSave(this.task);
            }
          } catch (e) {
            this.task = task;
          }
        }
      ),
      reaction(
        () => [
          this.isFocused,
          this.parent.draggableList.focused.length,
          this.isMultiSelected,
        ],
        () => {
          const isSingleFocused = this.isFocused && !this.isMultiSelected;
          const isTopFocused =
            this.isFocused &&
            this.isMultiSelected &&
            this.parent.draggableList.focused[0] === this.task.id;

          if (!this.hasListeners && (isSingleFocused || isTopFocused)) {
            this.hasListeners = true;
            this.setKeyDownListeners();
          } else if (this.hasListeners && !isTopFocused && !isSingleFocused) {
            this.hasListeners = false;
            this.removeKeyDownListeners();
          }
        }
      )
    );

  update = ({
    task,
    onFocus,
    onStatusChange,
    onWontDoWithComment,
    disableSpaceChange,
    disableGoalChange,
    onToggleMenu,
    isDragging,
    callbacks,
  }: TaskItemProps) => {
    this.task = task;
    this.disableSpaceChange = disableSpaceChange;
    this.disableGoalChange = disableGoalChange;

    this.onFocus = onFocus;
    this.onStatusChange = onStatusChange;
    this.onWontDoWithComment = onWontDoWithComment;
    this.onToggleMenu = onToggleMenu;

    this.isDragging = isDragging;
    this.callbacks = callbacks;
  };
}

export const {
  StoreProvider: TaskItemStoreProvider,
  useStore: useTaskItemStore,
} = getProvider(TaskItemStore);
