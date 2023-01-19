import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { RootStore } from '../../../../../stores/RootStore';
import {
  GoalsSelectionProps,
  GoalsSelectionStore,
} from '../../../../shared/GoalsSelection/store';
import { ListNavigation } from '../../../../../helpers/ListNavigation';

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
    onMouseDown?: () => void;
    onGoalCreateClick?: (cb: () => void) => void;
  };
  getItemsCount: () => number;
};

export class FocusConfigurationStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  navigation = new ListNavigation();
  goalsSelection = new GoalsSelectionStore(this.root);

  keyMap = {
    FOCUS_GOAL_SELECTION: 'shift+g',
    BLUR: 'right',
    NUMBER: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    CLEAR: ['shift+backspace', 'shift+delete', 'shift+c'],
    SHOW_IMPORTANT: 'i',
    ESCAPE: 'escape',
  };

  hotkeyHandlers = {
    BLUR: (e) => {
      if (this.isFocused) {
        e.stopPropagation();
        this.isBlockFocused = false;
        this.callbacks.onBlur?.();
      }
    },
    NUMBER: (e: KeyboardEvent) => {
      if (this.goalsSelection.isFocused) {
        const number = parseInt(e.key, 10);

        if (number && number <= this.root.resources.goals.count) {
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
      !this?.isFocused && this.focus();
    },
    ESCAPE: () => {
      if (this.isFocused) {
        this.isBlockFocused = false;
        this.callbacks.onBlur?.();
      }
    },
  };

  callbacks: FocusConfigurationProps['callbacks'] = {};

  isBlockFocused: boolean = false;

  data: FocusConfigurationData = {
    id: 'default',
    goals: [],
    showImportant: false,
  };

  get isFocused() {
    return this.isBlockFocused;
  }

  get hasConfiguration() {
    return this.data.goals.length > 0 || this.data.showImportant;
  }

  focus = () => {
    this.navigation.enable();
    this.navigation.focus();
    this.isBlockFocused = true;
    this.callbacks.onFocus?.();
  };

  handleBlur = () => {
    this.navigation.disable();
    this.isBlockFocused = false;
    this.callbacks.onBlur?.();
  };

  handleSelectGoal = () => {
    this.data.goals = this.goalsSelection.checked;
    this.sendChanges();
  };

  handleShowImportantChange = (e) => {
    this.data.showImportant = e.target.checked;
    this.sendChanges();
  };

  handleGoalCreateClick = () => {
    this.handleBlur();
    this.callbacks.onGoalCreateClick?.(() => {
      setTimeout(() => {
        this.navigation.enable();
        this.navigation.focus();
      }, 10);
    });
  };

  handleMouseDown = () => {
    this.isBlockFocused = false;
    this.callbacks.onBlur?.();
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

  goalsSelectionCallbacks: GoalsSelectionProps['callbacks'] = {
    onSelect: this.handleSelectGoal,
    onGoalCreateClick: this.handleGoalCreateClick,
  };
}

export const {
  StoreProvider: FocusConfigurationStoreProvider,
  useStore: useFocusConfigurationStore,
} = getProvider(FocusConfigurationStore);
