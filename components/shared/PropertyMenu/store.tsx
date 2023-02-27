import React from 'react';
import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from "../../../helpers/StoreProvider";

export type PropertyMenuCallbacks = {
  onExit: () => void;
  // onCreate: () => void;
};

export type PropertyMenuProps = {
  callbacks: PropertyMenuCallbacks;
  selectedId?: string | null;
}

export class PropertyMenuStore {
  callbacks: PropertyMenuCallbacks;
  buttonRef: HTMLButtonElement | null = null;
  isMenuOpen = false;
  selectedSpaceId: string | null = null;

  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  get defaultSpace() {
    return this.root.resources.spaces.list.find(
      ({ type }) => type === 'personal'
    );
  }

  get spaces() {
    return this.root.resources.spaces.list.map((space) => ({
      ...space,
      isSelected: space.id === this.selectedSpaceId,
    }));
  }

  get selectedSpace() {
    const space = this.root.resources.spaces.list.find(
      ({ id }) => id === this.selectedSpaceId
    );

    return {
      ...space,
      hoverColor: space.color + '.75'
    };
  }

  handleSuggestionSelect = (id: string) => {
    this.selectedSpaceId = id;

    this.toggleMenu();
  };

  update = (props: PropertyMenuProps) => {
    this.callbacks = props.callbacks;
    this.selectedSpaceId = props.selectedId;

    if (!this.selectedSpaceId) {
      this.selectedSpaceId = this.defaultSpace.id;
    }
  };

  focus = () => {
    this.buttonRef?.focus();
  };

  toggleMenu = () => {
    this.isMenuOpen = !this.isMenuOpen;

    if (!this.isMenuOpen) {
      this.callbacks.onExit();
    }
  }
}

export const {
  useStore: usePropertyMenuStore,
  StoreProvider: PropertyMenuStoreProvider
} = getProvider(PropertyMenuStore);
