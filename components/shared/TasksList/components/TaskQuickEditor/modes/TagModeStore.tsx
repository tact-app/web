import { NavigationDirections, TaskTag } from '../../../types';
import React, { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { makeAutoObservable } from 'mobx';

export type TagModeCallbacks = {
  onTagCreate: (tag: TaskTag) => void;
  onFocusLeave: (direction: NavigationDirections) => void;
  onExit: () => void;
};

export class TagModeStore {
  constructor(callbacks: TagModeCallbacks) {
    this.callbacks = callbacks;
    makeAutoObservable(this);
  }

  startSymbol = '#';

  callbacks: TagModeCallbacks;

  tagsMap: Record<string, TaskTag> = {};
  tags: Array<TaskTag & { ref?: HTMLButtonElement }> = [];
  strValue: string = '';

  get isFilled() {
    return this.tags.length > 0;
  }

  get availableTags() {
    return Object.values(this.tagsMap);
  }

  get filteredAvailableTags() {
    return this.availableTags.filter(({ title }) =>
      title.startsWith(this.strValue)
    );
  }

  get currentTagMatch() {
    return this.filteredAvailableTags.some(
      ({ title }) => title === this.strValue
    );
  }

  get suggestions() {
    const hasCreateNewTag = this.strValue.length > 1 && !this.currentTagMatch;

    const items = this.filteredAvailableTags.map(({ title }) => <>{title}</>);

    if (hasCreateNewTag) {
      items.unshift(
        <>
          {this.availableTags.length === 0 ? '' : 'Tag not found. '}Create new
          &quot;
          {this.strValue.slice(1)}&quot; tag
        </>
      );
    }

    if (
      items.length === 0 &&
      this.availableTags.length === 0 &&
      this.strValue === this.startSymbol
    ) {
      items.push(<>Start typing to create a new tag</>);
    }

    return items;
  }

  focus = (corner: 'first' | 'last') => {
    const index = corner === 'first' ? 0 : this.tags.length - 1;

    this.tags[index].ref?.focus();
  };

  setTagRef = (button: HTMLButtonElement, id: string) => {
    const tag = this.tags.find((tag) => tag.id === id);

    if (tag) {
      tag.ref = button;
    }
  };

  activate = () => {
    this.strValue = '#';
  };

  disable = () => {
    this.strValue = '';
    this.callbacks.onExit();
  };

  reset = () => {
    this.strValue = '';
    this.tags = [];
  };

  focusTag = (id: string) => {
    const tag = this.tags.find((tag) => tag.id === id);

    if (tag) {
      tag.ref?.focus();
    }
  };

  startTag = () => {
    this.activate();
  };

  removeTag = (id: string) => {
    const index = this.tags.findIndex((tag) => tag.id === id);
    this.tags.splice(index, 1);
  };

  addTag = (tag: TaskTag) => {
    this.tags.push(tag);
  };

  createNewTag = () => {
    const trimmedValue = this.strValue.trim();

    if (!this.tags.some(({ title: t }) => trimmedValue === t)) {
      if (!this.currentTagMatch) {
        const id = uuidv4();
        const newTag = { title: trimmedValue, id };

        this.addTag(newTag);

        this.callbacks.onTagCreate(newTag);
      } else {
        const tag = this.filteredAvailableTags.find(
          ({ title }) => title === trimmedValue
        );

        if (tag) {
          this.addTag(tag);
        }
      }
    }

    this.disable();
  };

  addAvailableTag = (id: string) => {
    if (!this.tags.some(({ id: tagId }) => tagId === id)) {
      const tag = this.availableTags.find((tag) => tag.id === id);

      this.addTag(tag);
      this.disable();
    }
  };

  enterTagsList = () => {
    if (this.tags.length) {
      this.tags[0].ref.focus();
    }
  };

  handleSuggestionSelect = (index: number) => {
    if (this.availableTags.length !== 0 || this.strValue !== this.startSymbol) {
      const hasCreateNewTag = this.strValue.length > 1 && !this.currentTagMatch;

      if (!hasCreateNewTag) {
        this.addAvailableTag(this.filteredAvailableTags[index].id);
      } else {
        this.createNewTag();
      }
    }
  };

  handleInput = (value: string) => {
    this.strValue = value;
  };

  handleButtonKeyDown = (
    e: ReactKeyboardEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation();

    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      const tagIndex = this.tags.findIndex((tag) => tag.id === id);

      this.removeTag(id);

      if (!this.tags.length) {
        this.callbacks.onFocusLeave(NavigationDirections.LEFT);
      } else if (this.tags[tagIndex - 1]) {
        this.tags[tagIndex - 1].ref.focus();
      } else if (this.tags[tagIndex]) {
        this.tags[tagIndex].ref.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const index = this.tags.findIndex((tag) => tag.id === id);

      if (index === 0) {
        this.callbacks.onFocusLeave(NavigationDirections.LEFT);
      } else {
        const nextTag = this.tags[index - 1];

        if (nextTag) {
          nextTag.ref.focus();
        } else {
          this.callbacks.onFocusLeave(NavigationDirections.LEFT);
        }
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const index = this.tags.findIndex((tag) => tag.id === id);
      const nextTag = this.tags[index + 1];

      if (nextTag) {
        nextTag.ref.focus();
      } else {
        this.callbacks.onFocusLeave(NavigationDirections.RIGHT);
      }
    }
  };
}
