import { ModalsController } from '../../../../helpers/ModalsController';
import { TaskDeleteModal } from './TaskDeleteModal';
import { TaskGoalAssignModal } from './TaskGoalAssignModal';
import { GoalCreationModal } from '../../Goals/modals/GoalCreationModal';
import { TasksStore } from '../store';
import { GoalData, GoalDescriptionData } from '../../Goals/types';
import { runInAction, toJS } from 'mobx';

export enum ModalsTypes {
  DELETE_TASK,
  WONTDO_TASK,
  GOAL_ASSIGN,
  GOAL_CREATION,
}

export class TasksModals {
  constructor(public parent: TasksStore) {
  }

  controller = new ModalsController({
    [ModalsTypes.DELETE_TASK]: TaskDeleteModal,
    [ModalsTypes.GOAL_ASSIGN]: TaskGoalAssignModal,
    [ModalsTypes.GOAL_CREATION]: GoalCreationModal,
  });

  openVerifyDeleteModal = (ids: string[], done: () => void) => {
    this.controller.open({
      type: ModalsTypes.DELETE_TASK,
      props: {
        onDelete: () => {
          this.parent.deleteTasks(ids);
          this.controller.close();
          done();
        },
        onClose: this.controller.close,
      }
    });
  }

  openGoalCreationModal = (cb?: () => void) => {
    this.controller.open({
      type: ModalsTypes.GOAL_CREATION,
      props: {
        onClose: () => {
          this.controller.close();
          cb?.();
        },
        onSave: (goal: GoalData, description?: GoalDescriptionData) => {
          runInAction(() => {
            this.parent.goals.push(goal);
            this.parent.root.api.goals.create(goal);

            if (description) {
              this.parent.root.api.descriptions.add({
                content: toJS(description.content),
                id: description.id,
              });
            }
          });

          this.controller.close();
          cb?.();
        }
      }
    });
  };

  openGoalAssignModal = (taskId?: string) => {
    const focused = this.parent.draggableList.focused;
    const value = taskId ? (
      this.parent.items[taskId].goalId
    ) : (
      this.parent.draggableList.focused.length === 1 ? (
        this.parent.items[this.parent.draggableList.focused[0]].goalId
      ) : null
    );

    this.controller.open({
      type: ModalsTypes.GOAL_ASSIGN,
      props: {
        callbacks: {
          onClose: this.controller.close,
          onGoalCreateClick: () => this.openGoalCreationModal(() => this.openGoalAssignModal(taskId)),
          onSelect: (goalId: string) => {
            if (taskId) {
              this.parent.assignGoal([taskId], goalId);
            } else {
              this.parent.assignGoal(focused, goalId);
            }
            this.controller.close();
          },
        },
        value,
        goals: this.parent.goals,
      }
    });
  };
}
