import React from 'react';
import { makeAutoObservable } from 'mobx';
import { chakra } from '@chakra-ui/react';
import { GoalIcon } from '../../GoalIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import { RootStore } from '../../../../stores/RootStore';

export type GoalModeCallbacks = {
  onExit: () => void;
};

export class GoalModeStore {
  constructor(public root: RootStore, callbacks: GoalModeCallbacks) {
    this.callbacks = callbacks;
    makeAutoObservable(this);
  }

  startSymbol = '*';

  callbacks: GoalModeCallbacks;

  isAlwaysFilled: boolean = false;
  buttonRef: HTMLButtonElement | null = null;
  isMenuOpen = false;

  strValue: string = '';
  selectedGoalId: string | null = null;

  get isFilled() {
    return this.selectedGoalId != null || this.isAlwaysFilled;
  }

  get filteredGoals() {
    const goalName = this.strValue.slice(1).toLowerCase();

    return this.root.resources.goals.list.filter(
      ({ title, id }) =>
        title.toLowerCase().startsWith(goalName) && id !== this.selectedGoalId
    );
  }

  get currentGoalMatch() {
    const goalName = this.strValue.slice(1).toLowerCase();

    return this.filteredGoals.some(
      ({ title }) => title.toLowerCase() === goalName
    );
  }

  get selectedGoal() {
    return this.root.resources.goals.getById(this.selectedGoalId);
  }

  get suggestions() {
    const goals = this.filteredGoals.map((goal) => (
      <chakra.div
        key={goal.id}
        pt={1}
        pb={1}
        w='100%'
        display='flex'
        alignItems='center'
      >
        <GoalIcon icon={goal.icon} />
        <chakra.span ml={3} overflow='hidden' textOverflow='ellipsis'>
          {goal.title}
        </chakra.span>
      </chakra.div>
    ));

    if (!goals.length) {
      if (this.root.resources.goals.count && this.strValue.length > 1) {
        goals.push(<>Goal not found</>);
      } else if (!this.root.resources.goals.count) {
        goals.push(<>You haven&apos;t created any goal yet</>);
      }
    }

    if (this.selectedGoalId && this.strValue.length <= 1) {
      goals.push(
        <chakra.span display='flex' alignItems='center'>
          <FontAwesomeIcon icon={faXmark} fixedWidth />
          <chakra.span ml={1}>Unlink goal</chakra.span>
        </chakra.span>
      );
    }

    return goals;
  }

  setAlwaysFilled = (isAlwaysFilled: boolean) => {
    this.isAlwaysFilled = isAlwaysFilled;
  };

  setButtonRef = (ref: HTMLButtonElement | null) => {
    this.buttonRef = ref;
  };

  focus = () => {
    this.buttonRef?.focus();
  };

  activate = () => {
    this.strValue = '^';
  };

  disable = () => {
    this.strValue = '';
    this.callbacks.onExit();
  };

  reset = () => {
    this.strValue = '';
    this.selectedGoalId = null;
  };

  handleSuggestionSelect = (index: number) => {
    if (this.selectedGoalId && index === this.filteredGoals.length) {
      this.selectedGoalId = null;
    } else if (this.filteredGoals.length) {
      this.selectedGoalId = this.filteredGoals[index].id;
    }

    this.disable();
  };

  handleInput = (strValue: string) => {
    this.strValue = strValue;
  };
}
