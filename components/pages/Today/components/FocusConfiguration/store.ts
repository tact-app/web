import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { RootStore } from '../../../../../stores/RootStore';
import { GoalsSelectionProps } from '../../../../shared/GoalsSelection/store';
import { ListNavigation } from '../../../../../helpers/ListNavigation';
import { AnimatedBlockParams } from "../../../../shared/AnimatedBlock";

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
  focusHighlightParams: AnimatedBlockParams;
};

export class FocusConfigurationStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  navigation = new ListNavigation({
    onFocused: () => {
      this.isBlockFocused = true;

      if (this.isGoalEditing) {
        this.callbacks.onFocus?.();
      }
    }
  });

  keyMap = {
    FOCUS_GOAL_SELECTION: 'g',
    BLUR: 'right',
    NUMBER: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    SHOW_IMPORTANT: 'h',
    ESCAPE: 'escape',
  };

  hotkeyHandlers = {
    BLUR: () => this.handleBlur(),
    NUMBER: (e: KeyboardEvent) => {
      if (this.isBlockFocused) {
        const number = parseInt(e.key, 10) - 1;

        if (this.navigation.refs[number]) {
          (this.navigation.refs[number] as HTMLInputElement).checked = true;
        }
      }
    },
    SHOW_IMPORTANT: () => {
      this.data.showImportant = !this.data.showImportant;
      this.sendChanges();
    },
    FOCUS_GOAL_SELECTION: () => {
      !this?.isBlockFocused && this.focus();
    },
    ESCAPE: () => this.handleBlur(),
  };

  callbacks: FocusConfigurationProps['callbacks'] = {};

  isBlockFocused: boolean = false;
  openedEmojiPickerMap: Record<string, boolean> = {};
  editingTitlesMap: Record<string, boolean> = {};
  isIntroducingClosed: boolean = false;

  data: FocusConfigurationData = {
    id: 'default',
    goals: [],
    showImportant: false,
  };

  get isGoalEditing() {
    return Object.values({ ...this.openedEmojiPickerMap, ...this.editingTitlesMap }).includes(true);
  }

  get goalsAndSpacesIndexesMap() {
    return this.root.resources.goals.listBySpaces.reduce((spacesAcc, item) => ({
      ...spacesAcc,
      [item.space.id]: 0,
      ...item.goals.reduce((acc, goal) => ({
        ...acc,
        [goal.id]: goal.customFields.order,
      }), {} as Record<string, number>),
    }), {} as Record<string, number>);
  }

  focus = () => {
    this.navigation.enable();
    this.navigation.focus();
    this.isBlockFocused = true;
    this.callbacks.onFocus?.();
  };

  handleBlur = () => {
    if (!this.isBlockFocused || this.isGoalEditing) {
      return;
    }

    this.navigation.disable();
    this.isBlockFocused = false;
    this.callbacks.onBlur?.();
  };

  handleSelectGoal = (goalsIds: string[]) => {
    this.isBlockFocused = true;
    this.data.goals = goalsIds;
    this.sendChanges();
  };

  handleShowImportantChange = (e) => {
    this.data.showImportant = e.target.checked;
    this.navigation.disable();
    this.sendChanges();
  };

  handleGoalCreateClick = () => {
    this.handleBlur();
    this.callbacks.onBlur?.();
    this.callbacks.onGoalCreateClick?.(() => {
      setTimeout(() => {
        this.navigation.enable();
        this.navigation.focus();
      }, 10);
    });
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

  closeIntroducing = () => {
    this.isIntroducingClosed = true;
  };

  update = (props: FocusConfigurationProps) => {
    this.callbacks = props.callbacks;
  };

  init = async () => {
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
    setRefs: this.navigation.setRefs,
    onSelect: this.handleSelectGoal,
    onGoalCreateClick: this.handleGoalCreateClick,
    onToggleTitleFocus: (id, isFocused) => {
      if (this.editingTitlesMap[id] !== isFocused) {
        this.editingTitlesMap[id] = isFocused;

        if (!isFocused) {
          this.navigation.refs[this.goalsAndSpacesIndexesMap[id]]?.focus();
        }
      }
    },
    onToggleOpenEmojiPicker: (id, isOpen) => {
      if (this.openedEmojiPickerMap[id] !== isOpen) {
        this.openedEmojiPickerMap[id] = isOpen;

        if (!isOpen) {
          this.navigation.refs[this.goalsAndSpacesIndexesMap[id]]?.focus();
        }
      }
    }
  };
}

export const {
  StoreProvider: FocusConfigurationStoreProvider,
  useStore: useFocusConfigurationStore,
} = getProvider(FocusConfigurationStore);
