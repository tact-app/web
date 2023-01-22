import { RootStore } from '../../../stores/RootStore';
import { makeAutoObservable, reaction, runInAction, toJS } from 'mobx';
import cloneDeep from 'lodash/cloneDeep';
import { getProvider } from '../../../helpers/StoreProvider';
import { NavigationDirections, TaskData, TaskStatus } from './types';
import { TaskQuickEditorProps } from '../TaskQuickEditor/store';
import {
  DraggableListCallbacks,
  DraggableListStore,
} from '../DraggableList/store';
import { TasksModals } from './modals/store';
import { subscriptions } from '../../../helpers/subscriptions';
import { TaskProps } from '../Task/store';
import { Lists } from './constants';

export type TasksListProps = {
  checkTaskActivity?: (task: TaskData) => boolean;
  highlightActiveTasks?: boolean;
  isHotkeysEnabled?: boolean;
  isReadOnly?: boolean;
  listId?: string;
  tasksReceiverName?: string;
  dnd?: boolean;
  callbacks?: {
    onFocusLeave?: (direction: NavigationDirections) => boolean;
    onFocusChange?: (ids: string[]) => void;
    onOpenTask?: (hasOpenedTask: boolean) => void;
    onCloseTask?: () => void;
    onSendTask?: (tasks: TaskData[]) => boolean;
    onInit?: () => void | Promise<void>;
    onReset?: () => void;
    onEmpty?: () => void;
  };
};

export class TasksListStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  modals = new TasksModals(this);
  draggableList = new DraggableListStore(this.root);

  checkTaskActivity: TasksListProps['checkTaskActivity'];

  listId: string = Lists.TODAY;
  items: Record<string, TaskData> = {};
  order: string[] = [];
  editingTaskId: null | string = null;
  openedTask: null | string = null;

  tasksReceiverName: string = '';

  highlightActiveTasks: boolean = false;
  isReadOnly: boolean = false;
  isForceHotkeysEnabled = true;
  isLoading: boolean = true;
  isItemMenuOpen: boolean = false;
  isEditorFocused: boolean = false;

  callbacks: TasksListProps['callbacks'] = {};

  keyMap = {
    DONE: ['alt+d', 'd'],
    GOAL: 'alt+g',
    MOVE: 'alt+m',
    WONT_DO: ['alt+shift+w'],
    FORCE_WONT_DO: ['alt+w'],
    EDIT: 'space',
    OPEN_AND_EDIT: 'enter',
    FOCUS_LEAVE_LEFT: 'left',
    FOCUS_LEAVE_RIGHT: 'right',
    OPEN: ['alt+o', 'enter'],
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
        this.openTask(this.draggableList.focused[0], true);
      }
    },
    GOAL: (e) => {
      e.preventDefault();
      if (this.draggableList.focused.length) {
        this.modals.openGoalAssignModal();
      }
    },
    OPEN: () => {
      if (!this.openedTask) {
        if (this.draggableList.focused.length) {
          if (this.openedTask === this.draggableList.focused[0]) {
            this.focusEditor();
          } else {
            this.openTask(this.draggableList.focused[0]);
          }
        }
      } else {
        this.focusEditor();
      }
    },
    MOVE: () => {
      this.sendTasks(this.draggableList.focused);
    },
    FOCUS_LEAVE_LEFT: () => {
      if (this.openedTask) {
        this.closeTask();
      } else if (this.callbacks.onFocusLeave?.(NavigationDirections.LEFT)) {
        this.draggableList.resetFocusedItem();
        this.setEditingTask(null);
      }
    },
    FOCUS_LEAVE_RIGHT: () => {
      if (this.openedTask) {
        this.focusEditor();
      } else if (this.callbacks.onFocusLeave?.(NavigationDirections.RIGHT)) {
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
    onFocusLeave: (direction: NavigationDirections) => {
      this.callbacks.onFocusLeave?.(direction);
    },
    onItemSecondClick: (id: string) => {
      this.openTask(id, true);
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

      this.callbacks.onFocusChange?.(ids);
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

  get hasTasks() {
    return this.order.length > 0;
  }

  canUnsetStatus = (status: TaskStatus) => {
    if (this.draggableList.focused.length) {
      return this.draggableList.focused.every(
        (id) => this.items[id].status === status
      );
    }

    return false;
  };

  removeFocus = () => {
    this.draggableList.resetFocusedItem();
    this.setEditingTask(null);
    this.closeTask();
  };

  handleNavigation = (direction: NavigationDirections) => {
    if (direction === NavigationDirections.LEFT) {
      this.callbacks.onFocusLeave?.(NavigationDirections.LEFT);

      return true;
    } else if (
      direction === NavigationDirections.DOWN ||
      direction === NavigationDirections.UP
    ) {
      if (this.hasTasks) {
        this.draggableList.handleNavigation(direction);
      } else {
        this.callbacks.onFocusLeave?.(direction);
      }

      return true;
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
      // TODO:debt find a way to avoid cloning
      //  see https://linear.app/octolab/issue/TACT-115/sync-the-goal-field-after-a-quick-edit-of-a-task
      this.items[id] = {...cloneDeep(this.items[id]), goalId};
    });

    this.root.api.tasks.assignGoal({
      goalId,
      taskIds: taskIds,
    });
  };

  handleToggleMenu = (isOpen: boolean) => {
    this.isItemMenuOpen = isOpen;
  };

  openTask = (taskId: string, withEditor?: boolean) => {
    this.openedTask = taskId;

    if (withEditor) {
      this.focusEditor();
    }

    this.callbacks.onOpenTask?.(!!this.openedTask);
  };

  closeTask = (silent?: boolean) => {
    const isTaskOpened = this.openedTask;

    this.openedTask = null;

    if (!silent && isTaskOpened) {
      this.callbacks.onCloseTask?.();
    }
  };

  focusEditor = () => {
    this.isEditorFocused = true;
  };

  blurEditor = () => {
    this.isEditorFocused = false;
  };

  createTask = (task: TaskData, withShift: boolean) => {
    const placement = withShift ? 'top' : 'bottom';

    this.items[task.id] = task;

    if (placement === 'top') {
      this.order.unshift(task.id);
    } else {
      this.order.push(task.id);
    }

    this.root.api.tasks.create(this.listId, task, placement);
  };

  deleteTasks = (ids: string[]) => {
    this.order = this.order.filter((id) => !ids.includes(id));
    this.root.api.tasks.delete(ids);

    ids.forEach((id) => {
      delete this.items[id];
    });

    if (!this.draggableList.hasFocusableItems) {
      this.callbacks.onEmpty?.();
    }
  };

  deleteWithVerify = (ids: string[]) => {
    this.modals.openVerifyDeleteModal(ids, () => {
      this.draggableList.focusAfterItems(ids);
      this.deleteTasks(ids);
    });
  };

  updateTask = (task: TaskData) => {
    task.title = task.title.trim();

    this.items[task.id] = task;
    this.root.api.tasks.update({ id: task.id, fields: toJS(task) });

    this.setEditingTask(null);
  };

  receiveTasks = (
    fromListId: string,
    toListId: string,
    tasks: TaskData[],
    destination?: number
  ) => {
    this.root.api.tasks.swap({
      fromListId,
      toListId,
      taskIds: tasks.map(({ id }) => id),
      destination,
    });

    tasks.forEach((task) => this.addTask(task, destination));
  };

  addTask = (task: TaskData, position?: number) => {
    this.items[task.id] = task;

    if (position !== undefined) {
      this.order.splice(position, 0, task.id);
    } else {
      this.order.push(task.id);
    }
  };

  detachTask = (taskId: string) => {
    const task = this.items[taskId];

    if (task) {
      const taskIndex = this.order.indexOf(taskId);

      this.order.splice(taskIndex, 1);
      delete this.items[taskId];
    }

    return task;
  };

  sendTasks = (taskIds: string[]) => {
    const tasks = taskIds.map((id) => this.items[id]);

    if (this.callbacks.onSendTask?.(tasks)) {
      this.draggableList.focusAfterItems(taskIds);

      taskIds.forEach((taskId) => this.detachTask(taskId));
    }

    if (!this.draggableList.hasFocusableItems) {
      this.callbacks.onEmpty?.();
    }
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

    const { tasks, order } = await this.root.api.tasks.list(this.listId);

    runInAction(() => {
      this.items = tasks;
      this.order = order;
      this.isLoading = false;
    });
  };

  subscribe = () => subscriptions(reaction(() => this.listId, this.loadTasks));

  reset = () => {
    this.editingTaskId = null;
    this.openedTask = null;
    this.callbacks.onReset?.();
  };

  init = async () => {
    await this.loadTasks();
    await this.callbacks.onInit?.();
  };

  update = (props: TasksListProps) => {
    this.callbacks = props.callbacks || {};
    this.checkTaskActivity = props.checkTaskActivity;
    this.highlightActiveTasks = props.highlightActiveTasks;
    this.isForceHotkeysEnabled = props.isHotkeysEnabled ?? true;
    this.isReadOnly = props.isReadOnly ?? false;
    this.listId = props.listId;
    this.tasksReceiverName = props.tasksReceiverName;
  };

  taskCallbacks: TaskProps['callbacks'] = {
    onClose: this.closeTask,
    onBlur: this.handleEditorBlur,
    onPreviousItem: this.handlePrevTask,
    onNextItem: this.handleNextTask,
    onStatusChange: this.handleStatusChange,
    onTaskChange: this.updateTask,
  };

  taskListItemCallbacks: TaskQuickEditorProps['callbacks'] = {
    onNavigate: this.handleTaskItemNavigation,
    onSave: this.updateTask,
  };
}

export const {
  useStore: useTasksListStore,
  StoreProvider: TasksListStoreProvider,
} = getProvider(TasksListStore);
