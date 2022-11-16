import { NavigationDirections, TaskTag } from '../../../types';
import React, { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { makeAutoObservable } from 'mobx';

export type TagModeCallbacks = {
  onTagCreate: (tag: TaskTag) => void;
  onFocusLeave: (direction: NavigationDirections) => void;
  onExit: () => void;
};

type TagWithRef = TaskTag & { ref?: HTMLButtonElement };

export class TagModeStore {
  constructor(callbacks: TagModeCallbacks) {
    this.callbacks = callbacks;
    makeAutoObservable(this);
  }

  startSymbol = '#';

  callbacks: TagModeCallbacks;

  tagsMap: Record<string, TaskTag> = {};
  tags: Array<TagWithRef> = [];
  strValue: string = '';

  get isFilled() {
    return this.tags.length > 0;
  }

  get availableTags() {
    return Object.values(this.tagsMap);
  }

  get filteredTags() {
    const trimmedValue = this.strValue.trim();

    return this.availableTags.filter(
      ({ title }) =>
        title.startsWith(trimmedValue) &&
        !this.tags.some(({ title: tagTitle }) => tagTitle === title)
    );
  }

  get currentTagMatch() {
    const trimmedValue = this.strValue.trim();

    return this.filteredTags.some(({ title }) => title === trimmedValue);
  }

  get hasTag() {
    const trimmedValue = this.strValue.trim();

    return this.tags.some(({ title: tagTitle }) => tagTitle === trimmedValue);
  }

  get isSearchEmpty() {
    return this.filteredTags.length === 0 && this.availableTags.length;
  }

  get isTagCreationAvailable() {
    return this.strValue.length > 1 && !this.currentTagMatch && !this.hasTag;
  }

  get suggestions() {
    const hasCreateNewTag = this.isTagCreationAvailable;
    const tags = this.filteredTags;
    const items = tags.slice(0, 15).map(({ title }) => <>{title}</>);

    if (hasCreateNewTag) {
      items.unshift(
        <>
          {this.isSearchEmpty ? 'Tag not found. ' : ''}Create new &quot;
          {this.strValue.slice(1)}&quot; tag
        </>
      );
    } else if (
      items.length === 0 &&
      tags.length === 0 &&
      this.strValue === this.startSymbol
    ) {
      items.push(<>Start typing to create a new tag</>);
    } else if (this.hasTag) {
      items.unshift(<>This tag is already used</>);
    }

    return items;
  }

  focus = (corner: 'first' | 'last') => {
    const index = corner === 'first' ? 0 : this.tags.length - 1;
    const tag = this.tags[index];

    this.focusTag(tag);
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

  focusTagById = (id: string) => {
    const tag = this.tags.find((tag) => tag.id === id);
    this.focusTag(tag);
  };

  focusTag = (tag?: TagWithRef) => {
    if (tag && tag.ref) {
      tag.ref.focus();
      tag.ref.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
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

    if (!this.hasTag && !this.currentTagMatch) {
      const id = uuidv4();
      const newTag = { title: trimmedValue, id };

      this.addTag(newTag);

      this.callbacks.onTagCreate(newTag);
    }

    this.disable();
  };

  addAvailableTag = (id: string) => {
    if (!this.tags.some(({ id: tagId }) => tagId === id)) {
      const tag = this.filteredTags.find((tag) => tag.id === id);

      this.addTag(tag);
      this.disable();
    }
  };

  enterTagsList = () => {
    if (this.tags.length) {
      this.focusTag(this.tags[0]);
    }
  };

  handleSuggestionSelect = (index: number) => {
    if (this.strValue !== this.startSymbol || this.filteredTags.length) {
      if (index === 0 && !this.currentTagMatch && !this.hasTag) {
        this.createNewTag();
        return;
      }

      if (!this.hasTag || index > 0) {
        const hasFirstItem = !this.currentTagMatch || this.hasTag;

        this.addAvailableTag(
          this.filteredTags[hasFirstItem ? index - 1 : index].id
        );
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
        this.focusTag(this.tags[tagIndex - 1]);
      } else if (this.tags[tagIndex]) {
        this.focusTag(this.tags[tagIndex]);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const index = this.tags.findIndex((tag) => tag.id === id);

      if (index === 0) {
        this.callbacks.onFocusLeave(NavigationDirections.LEFT);
      } else {
        const nextTag = this.tags[index - 1];

        if (nextTag) {
          this.focusTag(nextTag);
        } else {
          this.callbacks.onFocusLeave(NavigationDirections.LEFT);
        }
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const index = this.tags.findIndex((tag) => tag.id === id);
      const nextTag = this.tags[index + 1];

      if (nextTag) {
        this.focusTag(nextTag);
      } else {
        this.callbacks.onFocusLeave(NavigationDirections.RIGHT);
      }
    }
  };
}
