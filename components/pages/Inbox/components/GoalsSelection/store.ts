import { KeyboardEvent } from 'react';
import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { GoalData } from '../../../Goals/types';
import { getProvider } from '../../../../../helpers/StoreProvider';

export type GoalsSelectionProps = {
  callbacks?: {
    onSelect?: (goalIds: string[]) => void
    onFocus?: (goalId: string | null) => void;
  };

  multiple?: boolean;
  goals: GoalData[];
  checked?: string[];
}

export class GoalsSelectionStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  callbacks: GoalsSelectionProps['callbacks'] = {};

  goals: GoalsSelectionProps['goals'];

  emptyRef: HTMLDivElement | null = null;
  refs: HTMLDivElement[] = [];
  checkedGoals: Record<string, boolean> = {};
  isFocused: boolean = false;
  multiple: boolean = false;

  hotkeyHandlers = {
    UP: () => {
      if (!this.isFocused) {
        this.refs[this.refs.length - 1].focus();
      }
    },
    DOWN: () => {
      if (!this.isFocused) {
        this.refs[0].focus();
      }
    }
  };

  get checked() {
    return Object.keys(this.checkedGoals);
  }

  handleFocus = (index) => () => {
    this.isFocused = true;
    this.callbacks.onFocus?.(this.goals[index].id);
  };

  handleBlur = () => {
    this.isFocused = false;
    this.callbacks.onFocus?.(null);
  };

  handleGoalCheck = (goalId: string | null) => {
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
          [goalId]: true
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
  }

  focusFirst = () => {
    this.isFocused = true;

    if (!this.multiple) {
      this.focusEmpty();
    } else {
      this.focus(0);
    }
  }

  focusLast = () => {
    this.focus(this.goals.length - 1);
  }

  removeFocus = () => {
    this.refs.forEach(ref => ref.blur());

    if (this.emptyRef) {
      this.emptyRef.blur();
    }

    this.isFocused = false;
  }

  focusEmpty = () => {
    this.emptyRef.focus();
    this.isFocused = true;
  }

  focus = (index: number) => {
    this.refs[index].focus();
    this.isFocused = true;
  }

  handleKeyDown = (index) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
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

    if (e.key === 'ArrowDown') {
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
      this.handleGoalCheck(index === null ? null : this.goals[index].id);
    }
  };

  setRef = (index) => (ref) => {
    this.refs[index] = ref;
  };

  setEmptyRef = (ref) => {
    this.emptyRef = ref;
  };

  init = (props: GoalsSelectionProps) => {
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
          [props.checked[0]]: true
        };
      }
    }
  };
}

export const {
  StoreProvider: GoalsSelectionStoreProvider,
  useStore: useGoalsSelectionStore,
} = getProvider(GoalsSelectionStore);
