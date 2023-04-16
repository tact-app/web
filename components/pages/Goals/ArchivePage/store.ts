import { computed, makeObservable } from 'mobx';
import { RootStore } from '../../../../stores/RootStore';
import { getProvider } from '../../../../helpers/StoreProvider';
import { BaseGoalsStore } from "../stores/BaseGoalsStore";
import { GoalDataExtended } from "../types";

export class GoalsArchiveStore extends BaseGoalsStore {
  constructor(public root: RootStore) {
    super(root);

    makeObservable(this, {
      list: computed,
      hasGoals: computed,
    })
  }

  get list() {
    return Object.entries(this.extendedGoals).reduce((acc, [id, goals]) => {
      const archivedGoals = goals.filter((goal) => goal.isArchived);

      if (archivedGoals.length) {
        return {
          ...acc,
          [id]: archivedGoals,
        };
      }

      return acc;
    }, {} as Record<string, GoalDataExtended[]>)
  }

  get hasGoals() {
    return Boolean(Object.keys(this.list).length);
  }
}

export const {
  StoreProvider: GoalsArchiveStoreProvider,
  useStore: useGoalsArchiveStore
} = getProvider(GoalsArchiveStore);
