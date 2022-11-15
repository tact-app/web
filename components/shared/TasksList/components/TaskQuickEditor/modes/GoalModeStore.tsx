import React from 'react';
import { makeAutoObservable } from 'mobx';
import { GoalData } from '../../../../../pages/Goals/types';
import { chakra } from '@chakra-ui/react';
import { GoalIcon } from '../../../../../pages/Goals/components/GoalIcon';

export type GoalModeCallbacks = {
  onExit: () => void;
};

export class GoalModeStore {
  constructor(callbacks: GoalModeCallbacks) {
    this.callbacks = callbacks;
    makeAutoObservable(this);
  }

  startSymbol = '*';

  callbacks: GoalModeCallbacks;

  buttonRef: HTMLButtonElement | null = null;
  isMenuOpen = false;

  goals: GoalData[] = [];
  strValue: string = '';
  selectedGoalId: string | null = null;

  get isFilled() {
    return this.selectedGoalId != null;
  }

  get filteredGoals() {
    const goalName = this.strValue.slice(1).toLowerCase();

    return this.goals.filter(
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
    return this.goals.find(({ id }) => id === this.selectedGoalId);
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

    if (goals.length) {
      return goals;
    } else {
      return [<>Goal not found</>];
    }
  }

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
    if (this.filteredGoals.length) {
      this.selectedGoalId = this.filteredGoals[index].id;
    }

    this.disable();
  };

  handleInput = (strValue: string) => {
    this.strValue = strValue;
  };
}
