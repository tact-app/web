import { ModalsController } from '../../../../helpers/ModalsController';
import { TaskDeleteModal } from './TaskDeleteModal';
import { TaskGoalAssignModal } from './TaskGoalAssignModal';
import { GoalCreationModal } from '../../../pages/Goals/modals/GoalCreationModal';
import { TasksListStore } from '../store';
import { TaskWontDoModal } from './TaskWontDoModal';
import { TaskSpaceChangeModal } from './TaskSpaceChangeModal';
import { TaskPriority, TaskTag } from '../types';
import { SpaceCreationModal } from '../../../pages/Spaces/modals/SpaceCreationModal';
import { SpaceData } from '../../../pages/Spaces/types';
import { CreateGoalParams } from "../../../../stores/RootStore/Resources/GoalsStore";
import { TaskAddTagModal } from './TaskAddTagModal';
import { TaskPriorityModal } from './TaskPriorityModal';
import { toJS } from 'mobx';


export enum ModalsTypes {
  DELETE_TASK,
  WONT_DO_TASK,
  GOAL_ASSIGN,
  GOAL_CREATION,
  SPACE_CHANGE,
  SPACE_CREATION,
  ADD_TAG,
  SET_PRIORITY,
}

export class TasksModals {
  constructor(public parent: TasksListStore) { }

  controller = new ModalsController({
    [ModalsTypes.DELETE_TASK]: TaskDeleteModal,
    [ModalsTypes.WONT_DO_TASK]: TaskWontDoModal,
    [ModalsTypes.GOAL_ASSIGN]: TaskGoalAssignModal,
    [ModalsTypes.GOAL_CREATION]: GoalCreationModal,
    [ModalsTypes.SPACE_CHANGE]: TaskSpaceChangeModal,
    [ModalsTypes.SPACE_CREATION]: SpaceCreationModal,
    [ModalsTypes.ADD_TAG]: TaskAddTagModal,
    [ModalsTypes.SET_PRIORITY]: TaskPriorityModal,
  });

  openVerifyDeleteModal = (ids: string[], done?: () => void) => {
    this.controller.open({
      type: ModalsTypes.DELETE_TASK,
      props: {
        onDelete: () => {
          this.parent.deleteTasks(ids);
          this.controller.close();
          done?.();
        },
        onClose: this.controller.close,
      },
    });
  };

  openWontDoModal = (ids: string[], done?: () => void) => {
    this.controller.open({
      type: ModalsTypes.WONT_DO_TASK,
      props: {
        onSave: (reason: string) => {
          this.parent.setTaskWontDoReason(ids, reason);
          this.controller.close();
          done?.();
        },
        onClose: this.controller.close,
      },
    });
  };

  openAddTagModal = (taskId: string) => {
    const task = this.parent.items[taskId];
    this.controller.open({
      type: ModalsTypes.ADD_TAG,
      props: {
        callbacks: {
          onSave: (tags: TaskTag[]) => {
            this.parent.updateTask({
              ...task,
              tags: tags.map(({ id }) => id),
            });
            this.controller.close();
          },
          onClose: this.controller.close,
        },
        tags: task.tags,
      },
    });
  };

  openGoalCreationModal = (cb?: (goalId?: string) => void) => {
    this.controller.open({
      type: ModalsTypes.GOAL_CREATION,
      props: {
        onClose: () => {
          this.controller.close();
          cb && cb();
        },
        onSave: async (data: CreateGoalParams) => {
          await this.parent.root.resources.goals.add(data);
          this.controller.close();
          cb && cb();
        },
      },
    });
  };

  openPriorityModal = (taskId: string) => {
    const task = this.parent.items[taskId];
    this.controller.open({
      type: ModalsTypes.SET_PRIORITY,
      props: {
        callbacks:{
          onClose: this.controller.close,
          onSelect: (priority: TaskPriority) => {
            this.parent.updateTask({
              ...task,
              tags: toJS(task.tags),
              priority,
            });
            this.controller.close();
          },
        },
        priority: task.priority,
      },
    });
  };

  openGoalAssignModal = (taskId?: string, startGoalId?: string) => {
    const focused = this.parent.draggableList.focused;
    const value =
      startGoalId ||
      (taskId
        ? this.parent.items[taskId].goalId
        : this.parent.draggableList.focused.length === 1
          ? this.parent.items[this.parent.draggableList.focused[0]].goalId
          : null);

    this.controller.open({
      type: ModalsTypes.GOAL_ASSIGN,
      props: {
        callbacks: {
          onClose: this.controller.close,
          onGoalCreateClick: () => {
            this.openGoalCreationModal((goalId: string) => {
              this.openGoalAssignModal(taskId, goalId);
            });
          },
          onSelect: (goalId: string, spaceId: string) => {
            if (taskId) {
              this.parent.assignGoal([taskId], goalId, spaceId);
            } else {
              this.parent.assignGoal(focused, goalId, spaceId);
            }
            this.controller.close();
          },
        },
        value,
        taskCount: taskId ? 1 : focused.length,
      },
    });
  };

  openSpaceCreationModal = (cb?: (spaceId?: string) => void) => {
    this.controller.open({
      type: ModalsTypes.SPACE_CREATION,
      props: {
        callbacks: {
          onSave: (space: SpaceData) => {
            this.parent.root.api.spaces.add(space);
            this.controller.close();
            cb && cb();
          },
          onClose: () => {
            this.controller.close();
            cb && cb();
          },
        },
      },
    });
  };

  openSpaceChangeModal = (taskId?: string, startSpaceId?: string) => {
    const task = taskId
      ? this.parent.items[taskId]
      : this.parent.draggableList.focused.length === 1
        ? this.parent.items[this.parent.draggableList.focused[0]]
        : null;
    const spaceId = startSpaceId || task?.spaceId

    this.controller.open({
      type: ModalsTypes.SPACE_CHANGE,
      props: {
        callbacks: {
          onClose: this.controller.close,
          onSpaceCreateClick: () => {
            this.openSpaceCreationModal((spaceId: string) => {
              this.openSpaceChangeModal(taskId, spaceId);
            });
          },
          onSelect: (spaceId: string) => {
            this.parent.updateTask({
              ...task,
              spaceId,
              tags: toJS(task.tags)
            });
            this.controller.close();
          },
        },
        spaceId,
      },
    });
  };
}
