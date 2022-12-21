import React from 'react';
import { makeAutoObservable } from 'mobx';
import { chakra } from '@chakra-ui/react';
import { RootStore } from '../../../../stores/RootStore';

export type ReferenceModeCallbacks = {
  onExit: () => void;
};

export class ReferenceModeStore {
  constructor(public root: RootStore, callbacks: ReferenceModeCallbacks) {
    this.callbacks = callbacks;
    makeAutoObservable(this);
  }

  startSymbol = '@';

  callbacks: ReferenceModeCallbacks;

  isAlwaysFilled: boolean = false;
  buttonRef: HTMLButtonElement | null = null;
  isMenuOpen = false;

  strValue: string = '';
  selectedReferenceId: string | null = null;

  defaultReferences = [
    {
      id: 'today',
      title: '@Today',
    },
    {
      id: 'tomorrow',
      title: '@Tomorrow',
    },
    {
      id: 'week',
      title: '@Week',
    },
  ];

  get isFilled() {
    return this.selectedReferenceId != null || this.isAlwaysFilled;
  }

  get filteredReferences() {
    const referenceName = this.strValue.toLowerCase();

    return this.defaultReferences.filter(
      ({ title, id }) =>
        title.toLowerCase().startsWith(referenceName) &&
        id !== this.selectedReferenceId
    );
  }

  get currentReferenceMatch() {
    const referenceName = this.strValue.toLowerCase();

    return this.filteredReferences.some(
      ({ title }) => title.toLowerCase() === referenceName
    );
  }

  get selectedReference() {
    return this.defaultReferences.find(
      ({ id }) => id === this.selectedReferenceId
    );
  }

  get suggestions() {
    const references = this.filteredReferences.map((reference) => (
      <chakra.div
        key={reference.id}
        pt={1}
        pb={1}
        w='100%'
        display='flex'
        justifyContent='start'
      >
        <chakra.span overflow='hidden' textOverflow='ellipsis'>
          {reference.title}
        </chakra.span>
      </chakra.div>
    ));

    if (!references.length && this.strValue.length > 1) {
      references.push(<>Reference not found</>);
    }

    return references;
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
    this.selectedReferenceId = null;
  };

  handleSuggestionSelect = (index: number) => {
    if (this.selectedReferenceId && index === this.filteredReferences.length) {
      this.selectedReferenceId = null;
    } else if (this.filteredReferences.length) {
      this.selectedReferenceId = this.filteredReferences[index].id;
    }

    this.disable();
  };

  handleInput = (strValue: string) => {
    this.strValue = strValue;
  };
}
