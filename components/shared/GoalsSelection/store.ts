import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';

export type GoalsSelectionProps = {
  callbacks?: {
    onSelect?: (goalIds: string[]) => void;
    onGoalCreateClick?: () => void;
  };

  setRefs?: (index: number, ref: HTMLElement) => void;
  multiple?: boolean;
  checked?: string[];
  disableGoalSelection?: boolean;
};

export class GoalsSelectionStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  callbacks: GoalsSelectionProps['callbacks'] = {};

  checkedGoals: Record<string, boolean> = {};
  isFocused: boolean = false;
  multiple: boolean = false;
  disableGoalSelection: boolean = false;

  get checked() {
    return Object.keys(this.checkedGoals);
  }

  handleGoalCheck = (index: number | null) => {
    if (this.disableGoalSelection) {
      return;
    }

    const goalId =
      index === null ? null : this.root.resources.goals.getByIndex(index).id;

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
    this.multiple = props.multiple;
    this.disableGoalSelection = props.disableGoalSelection;

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
