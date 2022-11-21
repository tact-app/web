import React from 'react';
import { makeAutoObservable } from 'mobx';
import { SpaceData } from '../../../../../pages/Spaces/types';
import { chakra } from '@chakra-ui/react';
import { SpacesSmallIcon } from '../../../../../pages/Spaces/components/SpacesIcons/SpacesSmallIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';

export type SpaceModeCallbacks = {
  onExit: () => void;
};

export class SpaceModeStore {
  constructor(callbacks: SpaceModeCallbacks) {
    this.callbacks = callbacks;
    makeAutoObservable(this);
  }

  startSymbol = '^';

  callbacks: SpaceModeCallbacks;

  isMenuOpen = false;
  buttonRef: HTMLButtonElement | null = null;

  spaces: SpaceData[] = [];
  strValue: string = '';
  selectedSpaceId: string | null = null;

  get defaultSpace() {
    return this.spaces.find(({ type }) => type === 'personal');
  }

  get isFilled() {
    return this.selectedSpaceId != null;
  }

  get filteredSpaces() {
    const spaceName = this.strValue.slice(1).toLowerCase();

    return this.spaces.filter(({ name, id }) =>
      name.toLowerCase().startsWith(spaceName)
    );
  }

  get currentSpaceMatch() {
    const spaceName = this.strValue.slice(1).toLowerCase();

    return this.filteredSpaces.some(
      ({ name }) => name.toLowerCase() === spaceName
    );
  }

  get selectedSpace() {
    return this.spaces.find(({ id }) => id === this.selectedSpaceId);
  }

  get suggestions() {
    const spaces = this.filteredSpaces.map((space) => (
      <chakra.div
        key={space.id}
        pt={1}
        pb={1}
        w='100%'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <chakra.span display='flex' alignItems='center'>
          <SpacesSmallIcon space={space} />
          <chakra.span ml={3} mr={3} overflow='hidden' textOverflow='ellipsis'>
            {space.name}
          </chakra.span>
        </chakra.span>
        {space.id === this.selectedSpaceId ? (
          <FontAwesomeIcon icon={faCheck} fixedWidth />
        ) : null}
      </chakra.div>
    ));

    if (!spaces.length) {
      if (this.spaces.length && this.strValue.length > 1) {
        spaces.push(<>Space not found</>);
      } else if (!this.spaces.length) {
        spaces.push(<>You haven&apos;t created any space yet</>);
      }
    }

    return spaces;
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
    this.selectedSpaceId = this.defaultSpace.id;
  };

  handleSuggestionSelect = (index: number) => {
    if (this.filteredSpaces.length && index < this.filteredSpaces.length) {
      if (this.filteredSpaces[index].id === this.selectedSpaceId) {
        const newId = this.defaultSpace.id;

        if (newId !== this.selectedSpaceId) {
          this.selectedSpaceId = newId;
        }
      } else {
        this.selectedSpaceId = this.filteredSpaces[index].id;
      }
    }

    this.disable();
  };

  handleInput = (strValue: string) => {
    this.strValue = strValue;
  };
}
