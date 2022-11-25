import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { GoalData } from '../../pages/Goals/types';
import { getProvider } from '../../../helpers/StoreProvider';

export type GoalsSelectionProps = {
  callbacks?: {
    onSelect?: (goalIds: string[]) => void;
    onGoalCreateClick?: () => void;
  };

  setRefs?: (index: number, ref: HTMLElement) => void;
  multiple?: boolean;
  goals: GoalData[];
  checked?: string[];
};

export class GoalsSelectionStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  callbacks: GoalsSelectionProps['callbacks'] = {};

  goals: GoalsSelectionProps['goals'];

  checkedGoals: Record<string, boolean> = {};
  isFocused: boolean = false;
  multiple: boolean = false;

  get checked() {
    return Object.keys(this.checkedGoals);
  }

  handleGoalCheck = (index: number | null) => {
    const goalId = index === null ? null : this.goals[index].id;

    if (this.multiple) {
      if (goalId !== null) {
        if (this.checkedGoals[goalId]) {
          delete this.checkedGoals[goalId];
        } else {
          this.checkedGoals[goalId] = true;
        }
      } else {
        this.checkedGoals = {};
      }
    } else {
      if (goalId !== null) {
        this.checkedGoals = {
          [goalId]: true,
        };
      } else {
        this.checkedGoals = {};
      }
    }

    this.callbacks.onSelect?.(this.checked);
  };

  uncheckAll = () => {
    this.checkedGoals = {};
    this.callbacks.onSelect?.(this.checked);
  };

  update = (props: GoalsSelectionProps) => {
    this.callbacks = props.callbacks;
    this.goals = props.goals;
    this.multiple = props.multiple;

    if (props.checked) {
      if (this.multiple) {
        props.checked.forEach((id) => {
          this.checkedGoals[id] = true;
        });
      } else {
        this.checkedGoals = {
          [props.checked[0]]: true,
        };
      }
    }
  };
}

export const {
  StoreProvider: GoalsSelectionStoreProvider,
  useStore: useGoalsSelectionStore,
} = getProvider(GoalsSelectionStore);
