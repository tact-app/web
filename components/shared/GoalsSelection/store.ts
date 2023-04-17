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
};

export class GoalsSelectionStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  callbacks: GoalsSelectionProps['callbacks'] = {};

  checkedGoals: string[] = [];
  isFocused: boolean = false;
  multiple: boolean = false;

  isChecked = (id: string) => {
    return this.checkedGoals.includes(id);
  }

  handleGoalCheck = (id: string | null) => {
    if (this.multiple) {
      if (id) {
        if (this.isChecked(id)) {
          this.checkedGoals = this.checkedGoals.filter((checkedGoalId) => checkedGoalId !== id);
        } else {
          this.checkedGoals = [...this.checkedGoals, id];
        }
      } else {
        this.checkedGoals = [];
      }
    } else {
      if (id) {
        this.checkedGoals = [...this.checkedGoals, id];
      } else {
        this.checkedGoals = [];
      }
    }

    this.callbacks.onSelect?.(this.checkedGoals);
  };

  uncheckAll = () => {
    this.checkedGoals = [];
    this.callbacks.onSelect?.(this.checkedGoals);
  };

  update = (props: GoalsSelectionProps) => {
    this.callbacks = props.callbacks;
    this.multiple = props.multiple;

    if (props.checked) {
      if (this.multiple) {
        this.checkedGoals = props.checked;
      } else {
        this.checkedGoals = [props.checked[0]];
      }
    }
  };
}

export const {
  StoreProvider: GoalsSelectionStoreProvider,
  useStore: useGoalsSelectionStore,
} = getProvider(GoalsSelectionStore);
