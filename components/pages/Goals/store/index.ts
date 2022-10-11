import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../stores/RootStore';
import { getProvider } from '../../../../helpers/StoreProvider';
import { ModalsController } from '../../../../helpers/ModalsController';
import { GoalCreationModal } from '../modals/GoalCreationModal';
import { GoalConfigurationModal } from '../modals/GoalConfigurationModal';

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

  openNewGoalConfigurationModal = () => this.modals.open({
    type: GoalsModalsTypes.CONFIGURE_GOAL,
    props: {
      goalId: null,
      onClose: this.modals.close
    }
  })

  init = () => null;
}

export const {
  StoreProvider: GoalsStoreProvider,
  useStore: useGoalsStore,
} = getProvider(GoalsStore);