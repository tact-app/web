import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';
import { ModalsController } from '../../../helpers/ModalsController';
import { GoalCreationModal } from './modals/GoalCreationModal';
import { GoalConfigurationModal } from './modals/GoalConfigurationModal';
import { GoalData } from './types';
import { DescriptionData } from '../../../types/description';

export enum GoalsModalsTypes {
  CREATE_GOAL,
  CONFIGURE_GOAL,
}

const GoalsModals = {
  [GoalsModalsTypes.CREATE_GOAL]: GoalCreationModal,
  [GoalsModalsTypes.CONFIGURE_GOAL]: GoalConfigurationModal,
};

export class GoalsStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  modals = new ModalsController(GoalsModals);

  openNewGoalConfigurationModal = () =>
    this.modals.open({
      type: GoalsModalsTypes.CONFIGURE_GOAL,
      props: {
        goalId: null,
        onClose: this.modals.close,
      },
    });

  startGoalCreation = () => {
    this.modals.open({
      type: GoalsModalsTypes.CREATE_GOAL,
      props: {
        onSave: this.createGoal,
        onClose: this.modals.close,
      },
    });
  };

  editGoal = (goalId: string) => {
    this.modals.open({
      type: GoalsModalsTypes.CREATE_GOAL,
      props: {
        onSave: this.updateGoal,
        onClose: this.modals.close,
        editMode: true,
        goal: this.root.resources.goals.map[goalId],
      },
    });
  };

  updateGoal = (
    goal: GoalData,
    description?: DescriptionData,
    isNewDescription?: boolean
  ) => {
    this.root.resources.goals.update(goal, description, isNewDescription);
    this.modals.close();
  };

  createGoal = (goal: GoalData, description?: DescriptionData) => {
    this.root.resources.goals.add(goal, description);
    this.modals.close();
  };

  update = () => null;
}

export const { StoreProvider: GoalsStoreProvider, useStore: useGoalsStore } =
  getProvider(GoalsStore);
