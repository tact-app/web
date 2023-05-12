import { action, computed, makeObservable, observable } from 'mobx';
import { RootStore } from '../../../../stores/RootStore';
import { getProvider } from '../../../../helpers/StoreProvider';
import { BaseGoalsStore, GoalsModalsTypes } from "../stores/BaseGoalsStore";
import { GoalDataExtended } from "../types";
import { CreateGoalParams } from "../../../../stores/RootStore/Resources/GoalsStore";
import { KeyboardEvent } from 'react';
import { AnimationsStore } from '../../../../stores/AnimationsStore';

export class GoalsStore extends BaseGoalsStore {
  keymap = {
    CREATE_GOAL: ['n'],
  };

  hotkeysHandlers = {
    CREATE_GOAL: (e: KeyboardEvent) => {
      e.preventDefault();
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
    return Object.entries(this.extendedGoals).reduce((acc, [id, goals]) => {
      const notArchivedGoals = goals.filter((goal) => !goal.isArchived);

      if (notArchivedGoals.length) {
        return {
          ...acc,
          [id]: notArchivedGoals,
        };
      }

      return acc;
    }, {} as Record<string, GoalDataExtended[]>)
  }

  get hasGoals() {
    return Boolean(Object.keys(this.list).length);
  }

  get hasArchivedGoals() {
    return this.root.resources.goals.list.some((goal) => goal.isArchived);
  }

  cloneGoal = ({ customFields, ...goal }: GoalDataExtended) => {
    return this.root.resources.goals.cloneGoal(goal);
  }

  goToArchivePage = () => {
    return this.root.router.push('/goals/archive')
  };

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

          AnimationsStore.displayFireworks();
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
