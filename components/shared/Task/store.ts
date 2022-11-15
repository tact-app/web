import { RootStore } from '../../../stores/RootStore';
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
  };
  spaces: SpaceData[];
  tagsMap: Record<string, TaskTag>;
  goals: GoalData[];
  isExpanded?: boolean;
  isEditorFocused?: boolean;
  task: TaskData;
};

class TaskStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  quickEditor: TaskQuickEditorStore = new TaskQuickEditorStore(this.root);

  isExpanded: boolean = false;
  isEditorFocused: boolean = false;
  callbacks: TaskProps['callbacks'];
  data: TaskData | null = null;
  spaces: SpaceData[] = [];
  tagsMap: Record<string, TaskTag> = {};
  goals: GoalData[] = [];
  isDescriptionLoading: boolean = true;
  description: DescriptionData | null = null;
  modesOrder = [Modes.PRIORITY, Modes.GOAL, Modes.SPACE];

  get inputSpace() {
    return this.spaces.find((space) => space.id === this.data?.input.spaceId);
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

  handleDescriptionBlur = () => {
    if (this.description.content) {
      this.callbacks.onBlur?.();
      this.root.api.descriptions.update({
        id: this.description.id,
        fields: {
          content: toJS(this.description.content),
        },
      });
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
      if (direction === NavigationDirections.DOWN) {
        this.isEditorFocused = true;
      } else if (direction === NavigationDirections.UP) {
        const filledModes = this.quickEditor.filledModes;
        const firstMode = this.modesOrder.find((mode) =>
          filledModes.includes(mode)
        );

        if (firstMode) {
          this.quickEditor.modes[firstMode].focus();
        }
      }

      return true;
    },
    onModeNavigate: (mode: Modes, direction: NavigationDirections) => {
      if (direction === NavigationDirections.RIGHT) {
        const filledModes = this.quickEditor.filledModes;
        const orderIndex = this.modesOrder.indexOf(mode);
        const nextFilledMode = this.modesOrder
          .slice(orderIndex + 1)
          .find((orderedMode) => filledModes.includes(orderedMode));

        if (nextFilledMode) {
          this.quickEditor.modes[nextFilledMode].focus();
        }
      } else if (direction === NavigationDirections.LEFT) {
        const filledModes = this.quickEditor.filledModes;
        const orderIndex = this.modesOrder.indexOf(mode);
        const previousFilledMode = this.modesOrder
          .slice(0, orderIndex)
          .reverse()
          .find((orderedMode) => filledModes.includes(orderedMode));

        if (previousFilledMode) {
          this.quickEditor.modes[previousFilledMode].focus();
        }
      } else if (direction === NavigationDirections.DOWN) {
        this.quickEditor.setFocus(true);
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
    this.quickEditor.reset();

    this.data = props.task;
    this.spaces = props.spaces;
    this.tagsMap = props.tagsMap;
    this.goals = props.goals;
    this.isExpanded = props.isExpanded;
    this.isEditorFocused = props.isEditorFocused;
    this.callbacks = props.callbacks;
  };
}

export const { useStore: useTaskStore, StoreProvider: TaskStoreProvider } =
  getProvider(TaskStore);
