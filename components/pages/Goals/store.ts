import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';
import { ModalsController } from '../../../helpers/ModalsController';
import { GoalCreationModal } from './modals/GoalCreationModal';
import { GoalConfigurationModal } from './modals/GoalConfigurationModal';
import { GoalData, GoalDescriptionData } from './types';

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

  items: Record<string, GoalData> = {};
  order: string[] = [];
  descriptions: Record<string, GoalDescriptionData> = {};

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
        goal: this.items[goalId],
      },
    });
  };

  updateGoal = (goal: GoalData, description?: GoalDescriptionData) => {
    this.items[goal.id] = goal;
    this.root.api.goals.update({ id: goal.id, fields: goal });

    if (description) {
      this.descriptions[description.id] = description;
      this.root.api.descriptions.update({
        fields: { content: toJS(description.content) },
        id: description.id,
      });
    }

    this.modals.close();
  };

  createGoal = (goal: GoalData, description?: GoalDescriptionData) => {
    this.items[goal.id] = goal;
    this.order.push(goal.id);
    this.root.api.goals.create(goal);

    if (description) {
      this.descriptions[description.id] = description;
      this.root.api.descriptions.add({
        content: toJS(description.content),
        id: description.id,
      });
    }

    this.modals.close();
  };

  load = async () => {
    const { goals, order } = await this.root.api.goals.list('default');

    runInAction(() => {
      this.items = goals;
      this.order = order;
    });
  };

  init = async () => {
    await this.load();
  };
}

export const { StoreProvider: GoalsStoreProvider, useStore: useGoalsStore } =
  getProvider(GoalsStore);
