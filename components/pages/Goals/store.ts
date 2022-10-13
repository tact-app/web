import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';
import { ModalsController } from '../../../helpers/ModalsController';
import { GoalCreationModal } from './modals/GoalCreationModal';
import { GoalConfigurationModal } from './modals/GoalConfigurationModal';
import { GoalData } from './types';
import { v4 as uuidv4 } from 'uuid';

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

  modals = new ModalsController(GoalsModals);

  openNewGoalConfigurationModal = () => this.modals.open({
    type: GoalsModalsTypes.CONFIGURE_GOAL,
    props: {
      goalId: null,
      onClose: this.modals.close
    }
  });

  startGoalCreation = () => {
    this.modals.open({
      type: GoalsModalsTypes.CREATE_GOAL,
      props: {
        onCreate: this.createGoal,
        onClose: this.modals.close
      }
    });
  };

  createGoal = (data: GoalData) => {
    runInAction(() => {
      this.items[data.id] = data;
      this.order.push(data.id);
    });
    const { description, ...rest } = data;

    this.root.api.goals.addDescription({
      description: toJS(description),
      id: uuidv4(),
    });
    this.root.api.goals.create(rest);
    this.modals.close();
  };

  handleGoalClick = () => {

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

export const {
  StoreProvider: GoalsStoreProvider,
  useStore: useGoalsStore,
} = getProvider(GoalsStore);
