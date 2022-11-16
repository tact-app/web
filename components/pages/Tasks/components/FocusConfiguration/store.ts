import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { RootStore } from '../../../../../stores/RootStore';
import { GoalData } from '../../../Goals/types';
import { GoalsSelectionStore } from '../../../../shared/GoalsSelection/store';

export type FocusConfigurationData = {
  id: string;
  goals: string[];
  showImportant: boolean;
};

export type FocusConfigurationProps = {
  callbacks: {
    onChange?: (data: FocusConfigurationData) => void;
    onClose?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onGoalCreateClick?: () => void;
  };
  getItemsCount: () => number;
  goals: GoalData[];
};

export class FocusConfigurationStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  goalsSelection = new GoalsSelectionStore(this.root);

  keyMap = {
    FOCUS: 'left',
    FOCUS_GOAL_SELECTION: 'shift+g',
    BLUR: 'right',
    NUMBER: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    CLEAR: ['shift+backspace', 'shift+delete', 'shift+c'],
    SHOW_IMPORTANT: 'i',
  };

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
          this.goalsSelection.handleGoalCheck(number - 1);
        }
      }
    },
    CLEAR: () => {
      this.goalsSelection.uncheckAll();
    },
    SHOW_IMPORTANT: () => {
      this.data.showImportant = !this.data.showImportant;
      this.sendChanges();
    },
    FOCUS_GOAL_SELECTION: () => {
      this.goalsSelection.focusFirst();
      this.callbacks.onFocus?.();
    },
  };

  callbacks: FocusConfigurationProps['callbacks'] = {};
  goals: FocusConfigurationProps['goals'] = [];

  data: FocusConfigurationData = {
    id: 'default',
    goals: [],
    showImportant: false,
  };

  isFocused: boolean = false;

  get hasConfiguration() {
    return this.data.goals.length > 0 || this.data.showImportant;
  }

  handleSelectGoal = () => {
    this.data.goals = this.goalsSelection.checked;
    this.sendChanges();
  };

  handleShowImportantChange = (e) => {
    this.data.showImportant = e.target.checked;
    this.sendChanges();
  };

  sendChanges = () => {
    this.root.api.focusConfigurations.update({
      id: this.data.id,
      fields: {
        goals: toJS(this.data.goals),
        showImportant: this.data.showImportant,
      },
    });
    this.callbacks.onChange?.(this.data);
  };

  update = (props: FocusConfigurationProps) => {
    this.callbacks = props.callbacks;
    this.goals = props.goals;
  };

  init = async (props: FocusConfigurationProps) => {
    const focusConfig = await this.root.api.focusConfigurations.get(
      this.data.id
    );

    if (focusConfig) {
      runInAction(() => (this.data = focusConfig));
      this.callbacks.onChange?.(this.data);
    } else {
      await this.root.api.focusConfigurations.add(toJS(this.data));
    }
  };
}

export const {
  StoreProvider: FocusConfigurationStoreProvider,
  useStore: useFocusConfigurationStore,
} = getProvider(FocusConfigurationStore);
