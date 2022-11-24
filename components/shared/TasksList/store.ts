import { RootStore } from '../../../stores/RootStore';
import { makeAutoObservable, reaction, runInAction, toJS } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { NavigationDirections, TaskData, TaskStatus, TaskTag } from './types';
import {
  TaskQuickEditorProps,
  TaskQuickEditorStore,
} from './components/TaskQuickEditor/store';
import {
  DraggableListCallbacks,
  DraggableListStore,
} from '../DraggableList/store';
import { GoalData } from '../../pages/Goals/types';
import { TasksModals } from './modals/store';
import { subscriptions } from '../../../helpers/subscriptions';
import { SpaceData, SpacesInboxItemData } from '../../pages/Spaces/types';
import { TaskProps } from '../Task/store';

export type TasksListProps = {
  checkTaskActivity?: (task: TaskData) => boolean;
  highlightActiveTasks?: boolean;
  isHotkeysEnabled?: boolean;
  isCreatorEnabled?: boolean;
  isReadOnly?: boolean;
  input?: SpacesInboxItemData;
  dnd?: boolean;
  callbacks?: {
    onFocusLeave?: (direction: NavigationDirections) => boolean;
    onOpenTask?: (hasOpenedTask: boolean) => void;
    onCloseTask?: () => void;
    onInit?: () => void | Promise<void>;
  };
};

export class TasksListStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  modals = new TasksModals(this);
  draggableList = new DraggableListStore(this.root);
  creator = new TaskQuickEditorStore(this.root);

  input: SpacesInboxItemData | null = null;
  checkTaskActivity: TasksListProps['checkTaskActivity'];

  listId: string = 'default';
  items: Record<string, TaskData> = {};
  order: string[] = [];
  goals: GoalData[] = [];
  spaces: SpaceData[] = [];
  tags: TaskTag[] = [];
  tagsMap: Record<string, TaskTag> = {};
  editingTaskId: null | string = null;
  openedTask: null | string = null;

  highlightActiveTasks: boolean = false;
  isReadOnly: boolean = false;
  isCreatorEnabled: boolean = true;
  isForceHotkeysEnabled = true;
  isLoading: boolean = true;
  isItemMenuOpen: boolean = false;
  isEditorFocused: boolean = false;

  callbacks: TasksListProps['callbacks'] = {};

  keyMap = {
    DONE: 'alt+d',
    GOAL: 'alt+g',
    WONT_DO: ['alt+shift+w'],
    FORCE_WONT_DO: ['alt+w'],
    EDIT: 'space',
    OPEN_AND_EDIT: 'enter',
    FOCUS_LEAVE_LEFT: 'arrowleft',
    FOCUS_INPUT: 'n',
    OPEN: 'arrowright',
  };

  hotkeyHandlers = {
    DONE: () => {
      if (this.draggableList.focused.length) {
        this.setTasksStatus(this.draggableList.focused, TaskStatus.DONE);
      }
    },
    WONT_DO: () => {
      if (this.draggableList.focused.length) {
        const hasAnotherStatus = this.draggableList.focused.some(
          (id) => this.items[id].status !== TaskStatus.WONT_DO
        );

        if (hasAnotherStatus) {
          this.openWontDoModal(this.draggableList.focused);
        } else {
          this.setTasksStatus(this.draggableList.focused, TaskStatus.WONT_DO);
        }
      }
    },
    FORCE_WONT_DO: () => {
      if (this.draggableList.focused.length) {
        this.setTasksStatus(this.draggableList.focused, TaskStatus.WONT_DO);
      }
    },
    EDIT: (e) => {
      e.preventDefault();
      if (this.draggableList.focused.length === 1) {
        this.setEditingTask(
          this.draggableList.focused[this.draggableList.focused.length - 1]
        );
      }
    },
    OPEN_AND_EDIT: () => {
      if (this.draggableList.focused.length) {
        this.openTask(this.draggableList.focused[0]);
        this.isEditorFocused = true;
      }
    },
    GOAL: (e) => {
      e.preventDefault();
      if (this.draggableList.focused.length) {
        this.modals.openGoalAssignModal();
      }
    },
    FOCUS_INPUT: () => {
      this.draggableList.resetFocusedItem();
      this.setEditingTask(null);
      this.closeTask();
      this.creator.setFocus(true);
    },
    OPEN: () => {
      if (!this.openedTask) {
        if (this.draggableList.focused.length) {
          if (this.openedTask === this.draggableList.focused[0]) {
            this.isEditorFocused = true;
          } else {
            this.openTask(this.draggableList.focused[0]);
          }
        }
      } else {
        this.isEditorFocused = true;
      }
    },
    FOCUS_LEAVE_LEFT: () => {
      if (this.openedTask) {
        this.closeTask();
      } else if (this.callbacks.onFocusLeave?.(NavigationDirections.LEFT)) {
        this.draggableList.resetFocusedItem();
        this.setEditingTask(null);
      }
    },
  };

  draggableHandlers: DraggableListCallbacks = {
    onItemsRemove: (order: string[], ids: string[]) => {
      this.order = order;
      this.deleteTasks(ids);
    },
    onFocusLeave: () => {
      this.creator.setFocus(true);
    },
    onItemSecondClick: (id: string) => {
      this.setEditingTask(id);
    },
    onFocusedItemsChange: (ids: string[]) => {
      if (!ids.length) {
        this.closeTask();
        this.setEditingTask(null);
      } else {
        if (ids.length > 1 || this.editingTaskId !== ids[0]) {
          this.setEditingTask(null);
        }

        if (this.openedTask) {
          if (ids.length === 1) {
            this.openTask(ids[0]);
          } else {
            this.closeTask();
          }
        }
      }
    },
    onOrderChange: (
      order: string[],
      changedIds: string[],
      destinationIndex: number
    ) => {
      this.changeOrder(order, changedIds, destinationIndex);
    },
    onVerifyDelete: (ids: string[], done: () => void) => {
      this.modals.openVerifyDeleteModal(ids, done);
    },
    onEscape: () => {
      if (this.openedTask) {
        this.closeTask();

        return true;
      }

      return this.callbacks.onFocusLeave?.(NavigationDirections.INVARIANT);
    },
  };

  get isHotkeysEnabled() {
    return !!(
      this.isForceHotkeysEnabled &&
      !this.creator.isMenuOpen &&
      !this.isItemMenuOpen &&
      !this.draggableList.isDraggingActive &&
      !this.draggableList.isControlDraggingActive &&
      !this.modals.controller.isOpen
    );
  }

  get isMultiselect() {
    return this.draggableList.focused.length > 1;
  }

  get openedTaskData() {
    return this.items[this.openedTask];
  }

  get hasNextTask() {
    return this.draggableList.hasNextTask(this.openedTask);
  }

  get hasPrevTask() {
    return this.draggableList.hasPrevTask(this.openedTask);
  }

  handleNavigation = (direction: NavigationDirections) => {
    if (direction === NavigationDirections.LEFT) {
      this.callbacks.onFocusLeave?.(NavigationDirections.LEFT);
    } else if (
      direction === NavigationDirections.DOWN ||
      direction === NavigationDirections.UP
    ) {
      this.draggableList.handleNavigation(direction);
    }

    return true;
  };

  handleTaskItemNavigation = (direction: NavigationDirections) => {
    if (direction === NavigationDirections.INVARIANT && this.editingTaskId) {
      this.setEditingTask(null);

      return true;
    } else if (
      direction === NavigationDirections.DOWN ||
      direction === NavigationDirections.UP
    ) {
      return this.draggableList.handleNavigation(direction);
    }
  };

  handleWontDoWithComment = (id: string) => {
    this.openWontDoModal([id]);
  };

  handleStatusChange = (id: string, status: TaskStatus) => {
    const task = this.items[id];
    const newStatus = task.status === status ? TaskStatus.TODO : status;
    const isSameStatus = task.status === status;

    this.setTaskStatus(id, newStatus);

    if (
      !isSameStatus &&
      (newStatus === TaskStatus.DONE || newStatus === TaskStatus.WONT_DO)
    ) {
      setTimeout(() => {
        this.draggableList.focusNextItemWithFilter(id, (id: string) => {
          return this.items[id].status === TaskStatus.TODO;
        });
      });
    } else if (this.draggableList.focused[0] !== id) {
      this.draggableList.setFocusedItem(id);
    }
  };

  setTasksStatus = (ids: string[], status: TaskStatus) => {
    const hasAnotherStatus = ids.some((id) => this.items[id].status !== status);
    const newStatus = hasAnotherStatus ? status : TaskStatus.TODO;

    if (ids.length === 1 && newStatus !== TaskStatus.TODO) {
      this.draggableList.focusNextWithFilter((id: string) => {
        return this.items[id].status === TaskStatus.TODO;
      });
    }

    ids.forEach((id) => {
      this.setTaskStatus(id, newStatus);
    });
  };

  handleCreatorFocus = () => {
    this.draggableList.resetFocusedItem();
    this.setEditingTask(null);
    this.closeTask();
  };

  handleEditorBlur = () => {
    this.isEditorFocused = false;
  };

  handleNextTask = () => {
    this.draggableList.focusNextItem(this.openedTask);
  };

  handlePrevTask = () => {
    this.draggableList.focusPrevItem(this.openedTask);
  };

  assignGoal = (taskIds: string[], goalId: string) => {
    taskIds.forEach((id) => {
      this.items[id].goalId = goalId;
    });

    this.root.api.tasks.assignGoal({
      goalId,
      taskIds: taskIds,
    });
  };

  handleToggleMenu = (isOpen: boolean) => {
    this.isItemMenuOpen = isOpen;
  };

  openTask = (taskId: string) => {
    this.callbacks.onOpenTask?.(!!this.openedTask);
    this.openedTask = taskId;
  };

  closeTask = (silent?: boolean) => {
    if (!silent) {
      this.callbacks.onCloseTask?.();
    }

    this.openedTask = null;
  };

  createTask = (task: TaskData) => {
    task.title = task.title.trim();

    if (this.input) {
      task.input = toJS(this.input);
      task.spaceId = this.input.spaceId;
    }

    this.items[task.id] = task;
    this.order.push(task.id);

    this.root.api.tasks.create(task);
  };

  deleteTasks = (ids: string[]) => {
    ids.forEach((id) => {
      delete this.items[id];
    });

    this.order = this.order.filter((id) => !ids.includes(id));
    this.root.api.tasks.delete(this.listId, ids);
  };

  deleteWithVerify = (ids: string[]) => {
    this.modals.openVerifyDeleteModal(ids, () => {
      this.deleteTasks(ids);
    });
  };

  updateTask = (task: TaskData) => {
    task.title = task.title.trim();

    this.items[task.id] = task;

    this.root.api.tasks.update({ id: task.id, fields: toJS(task) });
  };

  createTag = (tag: TaskTag) => {
    this.tags.push(tag);
    this.tagsMap[tag.id] = tag;
    this.root.api.tags.create(tag);
  };

  changeOrder = (
    order: string[],
    changedItemIds: string[],
    destinationIndex: number
  ) => {
    this.order = order;

    this.root.api.tasks.order({
      listId: this.listId,
      taskIds: changedItemIds,
      destination: destinationIndex,
    });
  };

  setTaskStatus = (taskId: string, status: TaskStatus) => {
    const task = this.items[taskId];

    task.status = status;

    this.root.api.tasks.update({
      id: task.id,
      fields: { status },
    });
  };

  openWontDoModal = (ids: string[]) => {
    this.modals.openWontDoModal(ids, () => {
      this.setTasksStatus(ids, TaskStatus.WONT_DO);
    });
  };

  setTaskWontDoReason = (ids: string[], reason: string) => {
    ids.forEach((id) => {
      this.items[id].wontDoReason = reason;

      this.root.api.tasks.update({
        id: ids[0],
        fields: { wontDoReason: reason },
      });
    });
  };

  setEditingTask = (taskId: string | null) => {
    this.editingTaskId = taskId;
  };

  checkTask = (taskId: string) => {
    if (taskId) {
      return this.checkTaskActivity
        ? this.checkTaskActivity(this.items[taskId])
        : true;
    }

    return false;
  };

  loadTasks = async () => {
    this.isLoading = true;

    const { tasks, order } = await this.root.api.tasks.list(
      this.listId,
      this.input
        ? {
            inputId: this.input.id,
          }
        : {}
    );

    runInAction(() => {
      this.items = tasks;
      this.order = order;
      this.isLoading = false;
    });
  };

  loadTags = async () => {
    const tags = await this.root.api.tags.list();

    runInAction(() => {
      this.tags = tags;
      this.tagsMap = tags.reduce((acc, tag) => {
        acc[tag.id] = tag;
        return acc;
      }, {});
    });
  };

  loadGoals = async () => {
    const { goals, order } = await this.root.api.goals.list('default');

    runInAction(() => {
      this.goals = order.map((id) => goals[id]);
    });
  };

  loadSpaces = async () => {
    const spaces = await this.root.api.spaces.list();

    runInAction(() => {
      this.spaces = spaces;
    });
  };

  subscribe = () => subscriptions(reaction(() => this.input, this.loadTasks));

  reset = () => {
    this.editingTaskId = null;
    this.openedTask = null;
    this.creator.reset();
  };

  load = async () => {
    return Promise.all([
      this.loadTasks(),
      this.loadTags(),
      this.loadGoals(),
      this.loadSpaces(),
    ]);
  };

  init = async () => {
    await this.load();
    await this.callbacks.onInit?.();
  };

  update = (props: TasksListProps) => {
    this.callbacks = props.callbacks || {};
    this.checkTaskActivity = props.checkTaskActivity;
    this.highlightActiveTasks = props.highlightActiveTasks;
    this.isForceHotkeysEnabled = props.isHotkeysEnabled ?? true;
    this.isCreatorEnabled = props.isCreatorEnabled ?? true;
    this.isReadOnly = props.isReadOnly ?? false;
    this.input = props.input;
  };

  taskCallbacks: TaskProps['callbacks'] = {
    onClose: this.closeTask,
    onBlur: this.handleEditorBlur,
    onPreviousItem: this.handlePrevTask,
    onNextItem: this.handleNextTask,
    onStatusChange: this.handleStatusChange,
    onTaskChange: this.updateTask,
    onTagCreate: this.createTag,
  };

  taskListItemCallbacks: TaskQuickEditorProps['callbacks'] = {
    onNavigate: this.handleTaskItemNavigation,
    onSave: this.updateTask,
    onTagCreate: this.createTag,
  };
}

export const {
  useStore: useTasksListStore,
  StoreProvider: TasksListStoreProvider,
} = getProvider(TasksListStore);
