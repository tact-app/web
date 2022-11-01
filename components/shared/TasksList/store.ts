import { RootStore } from '../../../stores/RootStore';
import { makeAutoObservable, reaction, runInAction, toJS } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { TaskData, TaskStatus, TaskTag } from './types';
import { TaskQuickEditorStore } from './components/TaskQuickEditor/store';
import {
  DraggableListCallbacks,
  DraggableListStore,
} from '../DraggableList/store';
import { GoalData } from '../../pages/Goals/types';
import { TasksModals } from './modals/store';
import { subscriptions } from '../../../helpers/subscriptions';
import { SpacesInboxItemData } from '../../pages/Spaces/components/SpacesInbox/types';

export type TasksListProps = {
  checkTaskActivity?: (task: TaskData) => boolean;
  input?: SpacesInboxItemData;
  dnd?: boolean;
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
  tags: TaskTag[] = [];
  tagsMap: Record<string, TaskTag> = {};
  editingTaskId: null | string = null;
  openedTask: null | string = null;

  isLoading: boolean = true;
  isFocusModeActive: boolean = false;
  isItemMenuOpen: boolean = false;

  keyMap = {
    DONE: 'd',
    GOAL: 'g',
    FOCUS_INPUT: 'n',
    WONT_DO: ['w', 'cmd+w'],
    EDIT: 'space',
    OPEN: 'enter',
  };

  hotkeyHandlers = {
    DONE: () => {
      if (this.draggableList.focused.length) {
        this.setTasksStatus(this.draggableList.focused, TaskStatus.DONE);
      }
    },
    WONT_DO: () => {
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
    OPEN: () => {
      if (this.draggableList.focused.length) {
        this.openTask(this.draggableList.focused[0]);
      }
    },
    GOAL: (e) => {
      e.preventDefault();
      if (this.draggableList.focused.length) {
        this.modals.openGoalAssignModal();
      }
    },
    FOCUS_INPUT: () => {
      this.creator.setFocus(true);
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

  get isHotkeysEnabled() {
    return (
      !this.isItemMenuOpen &&
      !this.draggableList.isDraggingActive &&
      !this.draggableList.isControlDraggingActive &&
      !this.modals.controller.isOpen
    );
  }

  get openedTaskData() {
    return this.items[this.openedTask];
  }

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

  handleSuggestions = (state: boolean) => {
    if (state) {
      this.draggableList.disableOutsideClick();
    } else {
      this.draggableList.enableOutsideClick();
    }
  };

  createTask = (task: TaskData) => {
    task.title = task.title.trim();

    if (this.input) {
      task.input = toJS(this.input);
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

  updateTask = (task: TaskData) => {
    task.title = task.title.trim();

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

  checkTask = (taskId: string) => {
    return this.checkTaskActivity
      ? this.checkTaskActivity(this.items[taskId])
      : true;
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

  subscribe = () =>
    subscriptions(
      reaction(
        () => this.modals.controller.isOpen || this.isItemMenuOpen,
        (isOpen) => {
          if (isOpen) {
            this.draggableList.disableHotkeys();
          } else {
            this.draggableList.enableHotkeys();
          }
        }
      ),
      reaction(() => this.input, this.loadTasks)
    );

  reset = () => {
    this.editingTaskId = null;
    this.openedTask = null;
    this.creator.reset();
  };

  load = async () => {
    this.loadTasks();
    this.loadTags();
    this.loadGoals();
  };

  init = async () => {
    await this.load();
  };

  update = (props: TasksListProps) => {
    this.checkTaskActivity = props.checkTaskActivity;
    this.input = props.input;
  };
}

export const {
  useStore: useTasksListStore,
  StoreProvider: TasksListStoreProvider,
} = getProvider(TasksListStore);
