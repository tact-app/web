import { ModalsController } from '../../../../helpers/ModalsController';
import { GoalCreationModal } from '../../../pages/Goals/modals/GoalCreationModal';
import { SpaceCreationModal } from '../../../pages/Spaces/modals/SpaceCreationModal';
import { SpaceData } from '../../../pages/Spaces/types';
import { RootStore } from '../../../../stores/RootStore';
import { CreateGoalParams } from "../../../../stores/RootStore/Resources/GoalsStore";
import { TaskGoalAssignModal } from '../../TasksList/modals/TaskGoalAssignModal';
import { TaskSpaceChangeModal } from '../../TasksList/modals/TaskSpaceChangeModal';
import { TaskAddTagModal } from '../../TasksList/modals/TaskAddTagModal';
import { TaskQuickEditorStore } from '../store';
import { TaskPriorityModal } from '../../TasksList/modals/TaskPriorityModal';
import { TaskPriority, TaskTag } from '../../TasksList/types';


export enum ModalsTypes {
  ADD_GOAL,
  ADD_SPACE,
  GOAL_ASSIGN,
  SPACE_CHANGE,
  SPACE_CREATION,
  ADD_TAG,
  SET_PRIORITY,
}

export class TasksEditorModals {
  constructor(public root: RootStore, public parent: TaskQuickEditorStore) { }

  controller = new ModalsController({
    [ModalsTypes.ADD_GOAL]: GoalCreationModal,
    [ModalsTypes.ADD_SPACE]: SpaceCreationModal,
    [ModalsTypes.GOAL_ASSIGN]: TaskGoalAssignModal,
    [ModalsTypes.SPACE_CHANGE]: TaskSpaceChangeModal,
    [ModalsTypes.ADD_TAG]: TaskAddTagModal,
    [ModalsTypes.SET_PRIORITY]: TaskPriorityModal,
  });

  openGoalCreationModal = (cb?: () => void) => {
    this.root.toggleModal(true);
    this.controller.open({
      type: ModalsTypes.ADD_GOAL,
      props: {
        onSave: async (data: CreateGoalParams) => {
          await this.root.resources.goals.add(data);
          this.controller.close();
          this.root.toggleModal(false);
          cb && cb();
        },
        onClose: () => {
          this.controller.close();
          this.root.toggleModal(false);
          cb && cb();
        },
      },
    });
  };

  openSpaceCreationModal = (cb?: () => void) => {
    this.root.toggleModal(true);
    this.controller.open({
      type: ModalsTypes.ADD_SPACE,
      props: {
        callbacks: {
          onSave: (space: SpaceData) => {
            this.root.api.spaces.add(space);
            this.controller.close();
            this.root.toggleModal(false);
            cb && cb();
          },
          onClose: () => {
            this.controller.close();
            this.root.toggleModal(false);
            cb && cb();
          },
        },
      },
    });
  };

  openGoalAssignModal = () => {
    this.root.toggleModal(true);
    this.controller.open({
      type: ModalsTypes.GOAL_ASSIGN,
      props: {
        callbacks: {
          onClose: () => {
            this.controller.close();
            this.root.toggleModal(false);
          },
          onGoalCreateClick: () => {
            this.openGoalCreationModal(this.openGoalAssignModal);
          },
          onSelect: (goalId: string, spaceId: string) => {
            this.parent.modes.goal.selectedGoalId = goalId;

            if (spaceId) {
              this.parent.modes.space.selectedSpaceId = spaceId;
            }

            this.controller.close();
            this.root.toggleModal(false);
          },
        },
        value: this.parent.modes.goal.selectedGoalId,
      },
    });
  };

  openSpaceChangeModal = () => {
    this.root.toggleModal(true);
    this.controller.open({
      type: ModalsTypes.SPACE_CHANGE,
      props: {
        callbacks: {
          onClose: () => {
            this.controller.close();
            this.root.toggleModal(false);
          },
          onSpaceCreateClick: () => {
            this.openSpaceCreationModal(this.openSpaceChangeModal);
          },
          onSelect: (spaceId: string, resetGoal: boolean) => {
            this.parent.modes.space.selectedSpaceId = spaceId;

            if (resetGoal) {
              this.parent.modes.goal.selectedGoalId = null;
            }

            this.controller.close();
            this.root.toggleModal(false);
          },
        },
        spaceId: this.parent.modes.space.selectedSpaceId,
        goalId: this.parent.modes.goal.selectedGoalId,
      },
    });
  };

  openAddTagModal = () => {
    this.root.toggleModal(true);
    this.controller.open({
      type: ModalsTypes.ADD_TAG,
      props: {
        callbacks: {
          onSave: (tags: TaskTag[]) => {
            this.parent.modes.tag.updateTags(tags);
            this.controller.close();
          },
          onClose: () => {
            this.controller.close();
            this.root.toggleModal(false);
          },
        },
        tags: this.parent.modes.tag.tags.map(({ id }) => id),
      },
    });
  };

  openPriorityModal = () => {
    this.root.toggleModal(true);
    this.controller.open({
      type: ModalsTypes.SET_PRIORITY,
      props: {
        callbacks: {
          onClose: () => {
            this.controller.close();
            this.root.toggleModal(false);
          },
          onSelect: (priority: TaskPriority) => {
            this.parent.modes.priority.priority = priority;
            this.controller.close();
            this.root.toggleModal(false);
          },
        },
        priority: this.parent.modes.priority.priority,
      },
    });
  };
}
