import {
  TaskPriority,
  TaskPriorityArray,
  TaskPriorityKeys,
  TaskPriorityNames,
  TaskPriorityValues,
} from '../../../types';
import React, { KeyboardEvent } from 'react';
import { HStack, Text } from '@chakra-ui/react';
import { TaskPriorityIcon } from '../../../../Icons/TaskPriorityIcon';
import { makeAutoObservable } from 'mobx';

export type PriorityCallbacks = {
  onExit: () => void;
  onChangeSuggestionIndex: (index: number) => void;
};

export class PriorityModeStore {
  constructor(callbacks: PriorityCallbacks) {
    this.callbacks = callbacks;
    makeAutoObservable(this);
  }

  startSymbol = '!';
  exitSymbol = /[^!]/;

  callbacks: PriorityCallbacks;
  buttonRef: HTMLButtonElement | null = null;

  strValue: string = '';
  priority: TaskPriority = TaskPriority.NONE;

  get isFilled() {
    return this.priority !== TaskPriority.NONE;
  }

  get suggestions() {
    return TaskPriorityArray.map((key) => (
      <HStack key={key} justifyContent='space-between' w='100%'>
        <Text>{TaskPriorityNames[key]}</Text>
        <TaskPriorityIcon priority={key} />
      </HStack>
    ));
  }

  setButtonRef = (ref: HTMLButtonElement | null) => {
    this.buttonRef = ref;
  };

  focus = () => {
    this.buttonRef?.focus();
  };

  activate = () => {
    this.strValue = '!';
    this.priority = TaskPriority.LOW;
  };

  disable = () => {
    this.strValue = '';
    this.callbacks.onExit();
  };

  reset = () => {
    this.strValue = '';
    this.priority = TaskPriority.NONE;
  };

  startPriority = () => {
    this.activate();
  };

  setPriority = (value: TaskPriority) => {
    this.strValue = TaskPriorityValues[value];
    this.priority = value;

    this.callbacks.onChangeSuggestionIndex(TaskPriorityArray.indexOf(value));
  };

  commitPriority = () => {
    this.strValue = '';
    this.callbacks.onExit();
  };

  setPriorityAndCommit = (value: TaskPriority) => {
    this.setPriority(value);
    this.commitPriority();
  };

  handleInput = (value: string) => {
    if (value === '') {
      this.disable();
      return;
    }

    const priority = TaskPriorityKeys[value];

    if (priority) {
      this.setPriority(priority);
    }
  };

  handleSuggestionSelect = (index: number) => {
    this.setPriorityAndCommit(TaskPriorityArray[index]);
  };

  handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '!') {
      if (this.strValue.length < 3) {
        this.setPriority(TaskPriorityKeys[this.strValue + '!']);
      }
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      this.setPriority(TaskPriorityKeys[this.strValue.slice(0, -1)]);
    }
  };
}
