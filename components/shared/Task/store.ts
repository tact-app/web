import { RootStore } from '../../../stores/RootStore';
import { KeyboardEvent } from 'react';
import { makeAutoObservable, reaction, runInAction, toJS } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import {
  TaskData,
  TaskStatus,
  TaskTag,
} from '../TasksList/types';
import {
  Modes,
  TaskQuickEditorProps,
  TaskQuickEditorStore,
} from '../TaskQuickEditor/store';
import { DescriptionData } from '../../../types/description';
import { Editor, JSONContent } from '@tiptap/core';
import { v4 as uuidv4 } from 'uuid';
import { subscriptions } from '../../../helpers/subscriptions';
import { AnimatedBlockParams } from "../AnimatedBlock";
import { cloneDeep, isEqual } from "lodash";
import { NavigationDirections } from '../../../types/navigation';

export type TaskProps = {
  callbacks: {
    onClose?: () => void;
    onBlur?: () => void;
    onCollapse?: () => void;
    onExpand?: () => void;
    onNextItem?: (taskId: string, stay?: boolean) => void;
    onPreviousItem?: (taskId: string, stay?: boolean) => void;
    onStatusChange?: (taskId: string, status: TaskStatus) => void;
    onTaskChange?: (task: TaskData) => Promise<void>;
    onTagCreate?: (tag: TaskTag) => Promise<void>;
    onFocus?: () => void;
    onDescriptionChange?: (description: DescriptionData, isNotInitial: boolean) => void;
  };
  isExpanded?: boolean;
  hasPrevious?: boolean;
  hasNext?: boolean;
  isEditorFocused?: boolean;
  delayedCreation?: boolean;
  disableSpaceChange?: boolean;
  disableGoalChange?: boolean;
  task: TaskData;
  animateParams?: AnimatedBlockParams;
};

class DescriptionStore {
  content: JSONContent;

  set(content: JSONContent) {
    this.content = content;
  }

  get() {
    return this.content;
  }
}

class TaskStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  quickEditor: TaskQuickEditorStore = new TaskQuickEditorStore(this.root);

  editor: Editor;
  descriptionBlurTimeout: number = null;
  hasPrevious = true;
  hasNext = true;
  isExpanded: boolean = false;
  isEditorFocused: boolean = false;
  isFocused: boolean = false;
  callbacks: TaskProps['callbacks'];
  data: TaskData | null = null;
  isDescriptionLoading: boolean = true;
  descriptionId: string = '';
  delayedCreation: boolean = false;
  disableSpaceChange: boolean = false;
  disableGoalChange: boolean = false;
  descriptionContent: DescriptionStore = new DescriptionStore();
  modesOrder = [Modes.SPACE, Modes.PRIORITY, Modes.GOAL, Modes.TAG];
  initialDescription: DescriptionData;

  animateParams?: AnimatedBlockParams;

  get inputSpace() {
    return this.root.resources.spaces.getById(this.data?.input.spaceId);
  }

  get isWontDo() {
    return this.data?.status === TaskStatus.WONT_DO;
  }

  setEditor = (editor) => {
    this.editor = editor;
  };

  handleDescriptionChange = (content: JSONContent) => {
    this.descriptionContent.set(content);

    const descriptionData = { id: this.descriptionId, content };
    this.callbacks.onDescriptionChange?.(descriptionData, !isEqual(this.initialDescription, descriptionData));
  };

  setDescription = (description?: DescriptionData) => {
    if (description) {
      this.descriptionId = description.id;
      this.descriptionContent.set(description.content);
    } else {
      this.descriptionId = uuidv4();

      this.data.descriptionId = this.descriptionId;
      this.descriptionContent.set(undefined);
      this.editor?.commands.setContent([]);

      if (!this.delayedCreation) {
        this.root.api.descriptions.add({
          id: this.descriptionId,
          content: this.descriptionContent.get(),
        });
      }

      this.callbacks.onTaskChange?.(this.data);
    }
  };

  handleDescriptionFocus = () => {
    this.isEditorFocused = true;
    this.callbacks.onFocus?.();
    clearTimeout(this.descriptionBlurTimeout);
  };

  handleDescriptionBlur = (event?: FocusEvent) => {
    if (!event || !event.relatedTarget) {
      this.isEditorFocused = false;
    }

    this.descriptionBlurTimeout = setTimeout(
      this.saveAndExit,
      200
    ) as unknown as number;
  };

  saveDescription = () => {
    if (this.descriptionContent.get() && this.descriptionId && !this.delayedCreation) {
      this.root.api.descriptions.update({
        id: this.descriptionId,
        fields: {
          content: toJS(this.descriptionContent.get()),
        },
      });
    }
  };

  saveAndExit = () => {
    this.saveDescription();

    if (!this.quickEditor.isInputFocused) {
      this.callbacks.onBlur?.();
    }
  };

  handleNextItem = () => {
    this.handleDescriptionBlur();
    this.callbacks.onNextItem(this.data?.id, true);
  };

  handlePreviousItem = () => {
    this.handleDescriptionBlur();
    this.callbacks.onPreviousItem(this.data?.id, true);
  };

  handleClose = () => {
    this.handleDescriptionBlur();
    this.callbacks.onClose?.();
  };

  handleContainerKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.isExpanded) {
      e.stopPropagation();
      e.preventDefault();
      this.callbacks.onCollapse?.();
    } else if (e.key === 'e' && e.metaKey) {
      e.stopPropagation();
      e.preventDefault();
      if (this.isExpanded) {
        this.callbacks.onCollapse?.();
      } else {
        this.callbacks.onExpand?.();
      }
    }
  };

  handleStatusChange = (e) => {
    const newStatus = e.target.checked ? TaskStatus.DONE : TaskStatus.TODO;

    this.callbacks.onStatusChange?.(this.data.id, newStatus);
  };

  handleTaskChange = (task: TaskData) => {
    return this.callbacks.onTaskChange?.(task);
  };

  loadDescription = async () => {
    this.isDescriptionLoading = true;

    const description = this.data?.descriptionId
      ? await this.root.api.descriptions.get(this.data.descriptionId)
      : null;

    this.saveDescription();
    this.setDescription(description);
    this.initialDescription = cloneDeep(description);

    runInAction(() => (this.isDescriptionLoading = false));
  };

  quickEditorCallbacks: TaskQuickEditorProps['callbacks'] = {
    onNavigate: (direction: NavigationDirections) => {
      if (
        direction === NavigationDirections.DOWN ||
        direction === NavigationDirections.ENTER
      ) {
        this.isEditorFocused = true;
      } else if (direction === NavigationDirections.UP) {
        this.quickEditor.focusFirstFilledMode();

        return false;
      }

      return true;
    },
    onModeNavigate: (mode: Modes, direction: NavigationDirections) => {
      if (direction === NavigationDirections.DOWN) {
        this.quickEditor.setFocus(true);

        return true;
      }
    },
    onSave: this.handleTaskChange,
  };

  subscribe = () =>
    subscriptions(
      reaction(() => this.data?.id, this.loadDescription, {
        fireImmediately: true,
      }),
      reaction(
        () => [this.isEditorFocused, this.descriptionId],
        () => {
          if (this.isEditorFocused && this.editor && !this.editor.isDestroyed) {
            this.editor.commands.focus(true);
          }
        }
      ),
      reaction(
        () => [this.quickEditor.isInputFocused, this.isEditorFocused],
        () => {
          if (!this.isFocused && (this.quickEditor.isInputFocused || this.isEditorFocused)) {
            this.isFocused = true;
          }

          if (!this.quickEditor.isInputFocused && !this.isEditorFocused) {
            this.isFocused = false;
          }
        }
      )
    );

  update = (props: TaskProps) => {
    this.data = props.task;
    this.hasPrevious = props.hasPrevious;
    this.hasNext = props.hasNext;
    this.isExpanded = props.isExpanded;
    this.callbacks = props.callbacks;
    this.isEditorFocused = props.isEditorFocused;
    this.animateParams = props.animateParams;
    this.delayedCreation = props.delayedCreation;
    this.disableSpaceChange = props.disableSpaceChange;
    this.disableGoalChange = props.disableGoalChange;
  };
}

export const { useStore: useTaskStore, StoreProvider: TaskStoreProvider } =
  getProvider(TaskStore);
