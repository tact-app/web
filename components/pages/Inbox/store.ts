import { RootStore } from '../../../stores/RootStore';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { TaskData, TaskPriority, TaskStatus, TaskTag } from './types';
import { TaskQuickEditorStore } from './components/TaskQuickEditor/store';
import {
  DraggableListCallbacks,
  DraggableListStore,
} from '../../shared/DraggableList/store';
import { GoalData } from '../Goals/types';
import { FocusConfiguration } from './components/FocusConfiguration';
import { FocusConfigurationData } from './components/FocusConfiguration/store';
import { TasksModals } from './modals/store';

export class TasksStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  modals = new TasksModals(this);
  draggableList = new DraggableListStore(this.root);
  creator = new TaskQuickEditorStore(this.root);

  listId: string = 'default';
  items: Record<string, TaskData> = {};
  order: string[] = [];
  goals: GoalData[] = [];
  tags: TaskTag[] = [];
  tagsMap: Record<string, TaskTag> = {};
  editingTaskId: null | string = null;
  openedTask: null | string = null;
  focusModeConfiguration: FocusConfigurationData = {
    id: 'default',
    goals: [],
    showImportant: false,
  };

  isFocusModeActive: boolean = false;
  isItemMenuOpen: boolean = false;

  getHandler = (fn: (e) => void) => (e) => {
    if (
      !this.isItemMenuOpen &&
      !this.draggableList.isDraggingActive &&
      !this.draggableList.isControlDraggingActive &&
      !this.modals.controller.isOpen
    ) {
      fn(e);
    }
  };

  keyMap = {
    DONE: 'd',
    GOAL: 'g',
    FOCUS_INPUT: 'n',
    WONT_DO: ['w', 'cmd+w'],
    EDIT: 'space',
    OPEN: 'enter',
    FOCUS_MODE: 'f',
    SILENT_FOCUS_MODE: 'shift+f',
  };

  hotkeyHandlers = {
    DONE: this.getHandler(() => {
      if (this.draggableList.focused.length) {
        this.setTasksStatus(this.draggableList.focused, TaskStatus.DONE);
      }
    }),
    WONT_DO: this.getHandler(() => {
      if (this.draggableList.focused.length) {
        this.setTasksStatus(this.draggableList.focused, TaskStatus.WONT_DO);
      }
    }),
    EDIT: this.getHandler((e) => {
      e.preventDefault();
      if (this.draggableList.focused.length === 1) {
        this.setEditingTask(
          this.draggableList.focused[this.draggableList.focused.length - 1]
        );
      }
    }),
    OPEN: this.getHandler(() => {
      if (this.draggableList.focused.length) {
        this.openTask(this.draggableList.focused[0]);
      }
    }),
    GOAL: this.getHandler((e) => {
      e.preventDefault();
      if (this.draggableList.focused.length) {
        this.modals.openGoalAssignModal();
      }
    }),
    FOCUS_MODE: this.getHandler((e) => {
      e.preventDefault();
      this.toggleFocusMode();
    }),
    SILENT_FOCUS_MODE: this.getHandler((e) => {
      e.preventDefault();
      this.toggleFocusMode(true);
    }),
    FOCUS_INPUT: this.getHandler(() => {
      this.creator.setFocus(true);
    }),
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
      if (ids.length !== 1) {
        this.setEditingTask(null);
      } else {
        if (this.editingTaskId) {
          this.setEditingTask(ids[0]);
        }

        if (this.openedTask) {
          this.openTask(ids[0]);
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
        this.openedTask = null;

        return false;
      }

      return true;
    },
  };

  get openedTaskData() {
    return this.items[this.openedTask];
  }

  checkFocusModeMatch = (taskId: string) => {
    const { goals, showImportant } = this.focusModeConfiguration;

    if (this.isFocusModeActive) {
      const task = this.items[taskId];

      if (task && task.status === TaskStatus.TODO) {
        const priorityMatch = showImportant
          ? task.priority === TaskPriority.HIGH
          : true;
        const goalMatch = goals.length ? goals.includes(task.goalId) : false;

        if (showImportant && goals.length) {
          return priorityMatch && goalMatch;
        } else if (showImportant) {
          return priorityMatch;
        } else if (goals.length) {
          return goalMatch;
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
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

  openItemMenu = () => {
    this.isItemMenuOpen = true;
  };

  closeItemMenu = () => {
    this.isItemMenuOpen = false;
  };

  openTask = (taskId: string) => {
    this.openedTask = taskId;
  };

  closeTask = () => {
    this.openedTask = null;
  };

  toggleFocusMode = (silent?: boolean) => {
    if (!this.isFocusModeActive) {
      this.draggableList.resetFocusedItem();
    }

    const isOpen = !this.isFocusModeActive;
    this.isFocusModeActive = !this.isFocusModeActive;

    if (isOpen) {
      if (silent) {
        this.loadFocusModeConfiguration();
      } else {
        this.root.menu.setReplacer(FocusConfiguration, {
          goals: this.goals,
          getItemsCount: () => this.draggableList.activeItems.length,
          callbacks: {
            onChange: this.setFocusModeConfiguration,
            onClose: this.toggleFocusMode,
            onFocus: () => {
              this.draggableList.resetFocusedItem();
              this.draggableList.disableHotkeys();
            },
            onBlur: () => {
              this.draggableList.focusFirstItem();
              this.draggableList.enableHotkeys();
            },
            onGoalCreateClick: () => this.modals.openGoalCreationModal(),
          },
        });
      }
    } else {
      this.root.menu.resetReplacer();
    }
  };

  handleToggleFocusMode = () => {
    this.toggleFocusMode();
  };

  handleSuggestions = (state: boolean) => {
    if (state) {
      this.draggableList.disableOutsideClick();
    } else {
      this.draggableList.enableOutsideClick();
    }
  };

  loadFocusModeConfiguration = async () => {
    this.focusModeConfiguration = await this.root.api.focusConfigurations.get(
      'default'
    );
  };

  setFocusModeConfiguration = (data: FocusConfigurationData) => {
    this.focusModeConfiguration = data;
  };

  createTask = (task: TaskData) => {
    this.items[task.id] = task;
    this.order.push(task.id);

    this.root.api.tasks.create(task);
  };

  deleteTasks = (ids: string[]) => {
    ids.forEach((id) => {
      delete this.items[id];
    });

    this.root.api.tasks.delete(this.listId, ids);
  };

  updateTask = (task: TaskData) => {
    Object.assign(this.items[task.id], task);

    this.root.api.tasks.update({ id: task.id, fields: task });
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

  setTasksStatus = (ids: string[], status: TaskStatus) => {
    const hasAnotherStatus = ids.some((id) => this.items[id].status !== status);
    const newStatus = hasAnotherStatus ? status : TaskStatus.TODO;

    ids.forEach((id) => {
      this.setTaskStatus(id, newStatus);
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

  setEditingTask = (taskId: string | null) => {
    this.editingTaskId = taskId;
  };

  loadTasks = async () => {
    const { tasks, order } = await this.root.api.tasks.list(this.listId);

    runInAction(() => {
      this.items = tasks;
      this.order = order;
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

  subscribe = () => {
    return reaction(
      () => this.modals.controller.isOpen || this.isItemMenuOpen,
      (isOpen) => {
        if (isOpen) {
          this.draggableList.disableHotkeys();
        } else {
          this.draggableList.enableHotkeys();
        }
      }
    );
  };

  load = async () => {
    this.loadTasks();
    this.loadTags();
    this.loadGoals();
  };

  init = async () => {
    await this.load();
  };
}

export const { useStore: useTasksStore, StoreProvider: TasksStoreProvider } =
  getProvider(TasksStore);
