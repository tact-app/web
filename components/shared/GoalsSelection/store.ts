import { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { action, makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { GoalData } from '../../pages/Goals/types';
import { getProvider } from '../../../helpers/StoreProvider';

export type GoalsSelectionProps = {
  callbacks?: {
    onSelect?: (goalIds: string[]) => void;
    onFocus?: (goalId: string | null) => void;
    onGoalCreateClick?: () => void;
  };

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

  createGoalButtonRef: HTMLButtonElement | null = null;
  emptyRef: HTMLDivElement | null = null;
  refs: HTMLDivElement[] = [];
  checkedGoals: Record<string, boolean> = {};
  isFocused: boolean = false;
  multiple: boolean = false;

  keyMap = {
    UP: ['j', 'up'],
    DOWN: ['k', 'down'],
  };

  hotkeyHandlers = {
    UP: (e) => {
      if (!this.isFocused) {
        this.focusLast();
      }
    },
    DOWN: (e) => {
      if (!this.isFocused) {
        this.focusFirst();
      }
    },
  };

  get checked() {
    return Object.keys(this.checkedGoals);
  }

  handleFocus = (index) =>
    action(() => {
      this.isFocused = true;
      this.callbacks.onFocus?.(this.goals[index].id);
    });

  handleBlur = () => {
    this.isFocused = false;
    this.callbacks.onFocus?.(null);
  };

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

  focusFirst = () => {
    this.isFocused = true;

    if (this.goals.length) {
      if (!this.multiple) {
        this.focusEmpty();
      } else {
        this.focus(0);
      }
    } else if (this.createGoalButtonRef) {
      this.createGoalButtonRef.focus();
    }
  };

  focusLast = () => {
    this.isFocused = true;

    if (this.goals.length) {
      this.focus(this.goals.length - 1);
    } else if (this.createGoalButtonRef) {
      this.createGoalButtonRef.focus();
    }
  };

  removeFocus = () => {
    this.refs.forEach((ref) => ref.blur());

    if (this.emptyRef) {
      this.emptyRef.blur();
    }

    if (this.createGoalButtonRef) {
      this.createGoalButtonRef.blur();
    }

    this.isFocused = false;
  };

  focusEmpty = () => {
    this.emptyRef.focus();
    this.isFocused = true;
  };

  focus = (index: number) => {
    const ref = this.refs[index];

    if (ref) {
      this.refs[index].focus();
      this.isFocused = true;
    }
  };

  handleKeyDown =
    (index: number | null) => (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp' || e.key === 'j') {
        e.stopPropagation();
        e.preventDefault();

        if (index === 0 && !this.multiple) {
          this.focusEmpty();
        } else if (index > 0) {
          this.focus(index - 1);
        } else {
          this.focusLast();
        }
      }

      if (e.key === 'ArrowDown' || e.key === 'k') {
        e.stopPropagation();
        e.preventDefault();
        if (index === null) {
          this.focus(0);
        } else if (index !== this.goals.length - 1) {
          this.focus(index + 1);
        } else {
          this.focusFirst();
        }
      }

      if (e.key === 'Enter') {
        e.stopPropagation();
        e.preventDefault();
        this.handleGoalCheck(index);
      }
    };

  setRef = (index: number | null) => (ref) => {
    if (index === null) {
      this.emptyRef = ref;
    } else {
      this.refs[index] = ref;
    }
  };

  setCreateGoalButtonRef = (ref) => {
    this.createGoalButtonRef = ref;
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
