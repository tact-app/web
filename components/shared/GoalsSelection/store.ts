import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';

export type GoalsSelectionProps = {
  editable?: boolean;
  multiple?: boolean;
  hasInitialChecked?: boolean;
  checked?: string[];
  forModal?: boolean;
  callbacks?: {
    onToggleTitleFocus?: (id: string, isFocused: boolean) => void;
    onToggleOpenEmojiPicker?: (id: string, isOpen: boolean) => void;
    onSelect?: (goalIds: string[]) => void;
    onGoalCreateClick?: () => void;
    setRefs?: (index: number, ref: HTMLElement) => void;
  };
};

export class GoalsSelectionStore {
  callbacks: GoalsSelectionProps['callbacks'] = {};

  checkedGoals: string[] = [];
  hasInitialChecked: boolean = false;
  isFocused: boolean = false;
  multiple: boolean = false;
  editable: boolean = false;
  forModal: boolean = false;

  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

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
      this.checkedGoals = [id];
    }

    this.callbacks.onSelect?.(this.checkedGoals);
  };

  update = (props: GoalsSelectionProps) => {
    this.callbacks = props.callbacks;
    this.multiple = props.multiple;
    this.editable = props.editable;
    this.forModal = props.forModal;
    this.hasInitialChecked = props.hasInitialChecked;

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
