import { RootStore } from '../../../../../stores/RootStore';
import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { SyntheticEvent } from 'react';

export type GoalConfigurationProps = {
  goalId: string | null;
};

export class GoalConfigurationStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  goalId: string | null = null;

  value: string = '';

  handleChange = (e: SyntheticEvent) => {
    this.value = (e.target as HTMLInputElement).value;
  };

  init = ({ goalId }: GoalConfigurationProps) => {
    this.goalId = goalId;
  };
}

export const {
  StoreProvider: GoalConfigurationStoreProvider,
  useStore: useGoalConfigurationStore,
} = getProvider(GoalConfigurationStore);
