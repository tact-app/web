import { action, computed, makeObservable, observable } from 'mobx';
import { RootStore } from '../../../../stores/RootStore';
import { getProvider } from '../../../../helpers/StoreProvider';
import { BaseGoalsStore, GoalsModalsTypes } from "../stores/BaseGoalsStore";
import { GoalDataExtended } from "../types";
import { CreateGoalParams } from "../../../../stores/RootStore/Resources/GoalsStore";

export class GoalsStore extends BaseGoalsStore {
  keymap = {
    CREATE_GOAL: ['n'],
  };

  hotkeysHandlers = {
    CREATE_GOAL: () => {
      this.startGoalCreation();
    },
  };

  constructor(public root: RootStore) {
    super(root);

    makeObservable(this, {
      keymap: observable,
      hotkeysHandlers: observable,
      list: computed,
      hasGoals: computed,
      cloneGoal: action.bound,
      startGoalCreation: action.bound,
    });
  }

  get list() {
    return this.extendedGoals;
  }

  get hasGoals() {
    return Object.keys(this.list).length;
  }

  cloneGoal = ({ customFields, ...goal }: GoalDataExtended) => {
    return this.root.resources.goals.cloneGoal(goal);
  }

  startGoalCreation = () => {
    this.modals.open({
      type: GoalsModalsTypes.CREATE_OR_UPDATE_GOAL,
      props: {
        onSave: async ({
          goal: { customFields, ...goal },
          ...otherParams
        }: CreateGoalParams<GoalDataExtended>) => {
          await this.root.resources.goals.add({ goal, ...otherParams });
          await this.loadTaskList();
          this.modals.close();
        },
        onClose: this.modals.close,
      },
    });
  };
}

export const {
  StoreProvider: GoalsStoreProvider,
  useStore: useGoalsStore
} = getProvider(GoalsStore);
