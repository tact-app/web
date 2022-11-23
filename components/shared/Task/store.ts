import { RootStore } from '../../../stores/RootStore';
import { KeyboardEvent } from 'react';
import { makeAutoObservable, reaction, runInAction, toJS } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import {
  NavigationDirections,
  TaskData,
  TaskStatus,
  TaskTag,
} from '../TasksList/types';
import {
  Modes,
  TaskQuickEditorProps,
  TaskQuickEditorStore,
} from '../TasksList/components/TaskQuickEditor/store';
import { DescriptionData } from '../../../types/description';
import { JSONContent } from '@tiptap/core';
import { v4 as uuidv4 } from 'uuid';
import { SpaceData } from '../../pages/Spaces/types';
import { GoalData } from '../../pages/Goals/types';

export type TaskProps = {
  callbacks: {
    onClose?: () => void;
    onBlur?: () => void;
    onCollapse?: () => void;
    onExpand?: () => void;
    onNextItem?: (taskId: string, stay?: boolean) => void;
    onPreviousItem?: (taskId: string, stay?: boolean) => void;
    onStatusChange?: (taskId: string, status: TaskStatus) => void;
    onTaskChange?: (task: TaskData) => void;
    onTagCreate?: (tag: TaskTag) => void;
    onFocus?: () => void;
  };
  spaces: SpaceData[];
  tagsMap: Record<string, TaskTag>;
  goals: GoalData[];
  isExpanded?: boolean;
  hasPrevious?: boolean;
  hasNext?: boolean;
  isEditorFocused?: boolean;
  task: TaskData;
};

class TaskStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  quickEditor: TaskQuickEditorStore = new TaskQuickEditorStore(this.root);

  hasPrevious = true;
  hasNext = true;
  isExpanded: boolean = false;
  isEditorFocused: boolean = false;
  callbacks: TaskProps['callbacks'];
  data: TaskData | null = null;
  spaces: SpaceData[] = [];
  tagsMap: Record<string, TaskTag> = {};
  goals: GoalData[] = [];
  isDescriptionLoading: boolean = true;
  description: DescriptionData | null = null;
  modesOrder = [Modes.PRIORITY, Modes.GOAL, Modes.SPACE, Modes.TAG];

  get inputSpace() {
    return this.spaces.find((space) => space.id === this.data?.input.spaceId);
  }

  get isWontDo() {
    return this.data?.status === TaskStatus.WONT_DO;
  }

  handleDescriptionChange = (content: JSONContent) => {
    this.description.content = content;
  };

  setDescription = (description?: DescriptionData) => {
    if (description) {
      this.description = description;
    } else {
      this.description = {
        id: uuidv4(),
        content: undefined,
      };

      this.data.descriptionId = this.description.id;
      this.root.api.tasks.update({
        id: this.data.id,
        fields: {
          descriptionId: this.description.id,
        },
      });
      this.root.api.descriptions.add({
        id: this.description.id,
        content: toJS(this.description.content),
      });
    }
  };

  handleDescriptionFocus = () => {
    this.isEditorFocused = true;
  };

  handleDescriptionBlur = () => {
    if (this.description.content) {
      this.root.api.descriptions.update({
        id: this.description.id,
        fields: {
          content: toJS(this.description.content),
        },
      });
    }

    this.isEditorFocused = false;
    this.callbacks.onBlur?.();
  };

  handleNextItem = () => {
    this.handleDescriptionBlur();
    this.callbacks.onNextItem(this.data?.id, true);
  };

  handlePreviousItem = () => {
    this.handleDescriptionBlur();
    this.callbacks.onPreviousItem(this.data?.id, true);
  };

  handleExpand = () => {
    this.callbacks.onExpand?.();
  };

  handleCollapse = () => {
    this.callbacks.onCollapse?.();
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
    this.callbacks.onTaskChange?.(task);
  };

  loadDescription = async () => {
    this.isDescriptionLoading = true;

    const description = this.data?.descriptionId
      ? await this.root.api.descriptions.get(this.data.descriptionId)
      : null;

    this.setDescription(description);

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
    onTagCreate: (tag: TaskTag) => this.callbacks.onTagCreate?.(tag),
  };

  subscribe = () =>
    reaction(() => this.data?.id, this.loadDescription, {
      fireImmediately: true,
    });

  update = (props: TaskProps) => {
    this.data = props.task;
    this.spaces = props.spaces;
    this.tagsMap = props.tagsMap;
    this.goals = props.goals;
    this.hasPrevious = props.hasPrevious;
    this.hasNext = props.hasNext;
    this.isExpanded = props.isExpanded;
    this.isEditorFocused = props.isEditorFocused;
    this.callbacks = props.callbacks;
  };
}

export const { useStore: useTaskStore, StoreProvider: TaskStoreProvider } =
  getProvider(TaskStore);
