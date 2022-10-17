import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { RootStore } from '../../../../../stores/RootStore';
import { GoalData } from '../../../Goals/types';
import { GoalsSelectionStore } from '../GoalsSelection/store';

export type FocusConfigurationProps = {
  callbacks: {
    onClose?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
  },
  goals: GoalData[],
  checked: string[],
};

export class FocusConfigurationStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  goalsSelection = new GoalsSelectionStore(this.root);

  keyMap = {
    FOCUS: 'ArrowLeft',
    BLUR: 'ArrowRight',
    NUMBER: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    CLEAR: 'shift+c',
    SHOW_IMPORTANT: 'i',
  }

  hotkeyHandlers = {
    FOCUS: () => {
      this.goalsSelection.focusFirst();
      this.callbacks.onFocus?.();
    },
    BLUR: () => {
      this.goalsSelection.removeFocus();
      this.callbacks.onBlur?.();
    },
    NUMBER: (e: KeyboardEvent) => {
      if (this.goalsSelection.isFocused) {
        const number = parseInt(e.key, 10);

        if (number && number <= this.goals.length) {
          const id = this.goals[number - 1].id;

          this.goalsSelection.handleGoalCheck(id);
        }
      }
    },
    CLEAR: () => {
      this.goalsSelection.uncheckAll();
    },
    SHOW_IMPORTANT: () => {
      this.showImportant = !this.showImportant;
    },
  }

  callbacks: FocusConfigurationProps['callbacks'] = {};
  goals: FocusConfigurationProps['goals'] = [];
  checkedGoals: string[] = [];
  isFocused: boolean = false;
  showImportant: boolean = false;

  init = (props: FocusConfigurationProps) => {
    this.callbacks = props.callbacks;
    this.goals = props.goals;
    this.checkedGoals = props.checked;
  };
}

export const {
  StoreProvider: FocusConfigurationStoreProvider,
  useStore: useFocusConfigurationStore,
} = getProvider(FocusConfigurationStore);
