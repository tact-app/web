import { NavigationDirections, TaskTag } from '../../TasksList/types';
import React, { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../stores/RootStore';

export type TagModeCallbacks = {
  onFocusLeave: (direction: NavigationDirections) => void;
  onExit: () => void;
};

type TagWithRef = TaskTag & { ref?: HTMLButtonElement };

export class TagModeStore {
  constructor(public root: RootStore, callbacks: TagModeCallbacks) {
    this.callbacks = callbacks;
    makeAutoObservable(this);
  }

  maxLength = 21;
  startSymbol = '#';

  isCollapsable = false;
  isCollapsed = false;
  isCollapseOpen = false;

  containerRef: HTMLDivElement | null = null;
  collapseRef?: HTMLButtonElement;

  callbacks: TagModeCallbacks;

  tags: Array<TagWithRef> = [];
  strValue: string = '';

  get trimmedStrValue() {
    return this.strValue.trim();
  }

  get isFilled() {
    return this.tags.length > 0;
  }

  get availableTags() {
    return this.root.resources.tags.list;
  }

  get overflow() {
    return this.strValue.length >= this.maxLength;
  }

  get filteredTags() {
    return this.availableTags.filter(
      ({ title }) =>
        title.startsWith(this.trimmedStrValue) &&
        !this.tags.some(({ title: tagTitle }) => tagTitle === title)
    );
  }

  get currentTagMatch() {
    return this.filteredTags.some(
      ({ title }) => title === this.trimmedStrValue
    );
  }

  get hasTag() {
    return this.tags.some(
      ({ title: tagTitle }) => tagTitle === this.trimmedStrValue
    );
  }

  get isSearchEmpty() {
    return this.filteredTags.length === 0 && this.availableTags.length;
  }

  get isTagCreationAvailable() {
    return (
      this.trimmedStrValue.length > 1 && !this.currentTagMatch && !this.hasTag
    );
  }

  get suggestions() {
    const hasCreateNewTag = this.isTagCreationAvailable;
    const tags = this.filteredTags;
    const items = tags.slice(0, 15).map(({ title }) => <>{title}</>);

    if (hasCreateNewTag) {
      items.unshift(
        <>
          {this.isSearchEmpty ? 'Tag not found. ' : ''}Create new &quot;
          {this.trimmedStrValue.slice(1)}&quot; tag
        </>
      );
    } else if (
      items.length === 0 &&
      tags.length === 0 &&
      this.trimmedStrValue === this.startSymbol
    ) {
      items.push(<>Start typing to create a new tag</>);
    } else if (this.hasTag) {
      items.unshift(<>This tag is already used</>);
    }

    return items;
  }

  setIsCollapsable = (isCollapsable: boolean) => {
    this.isCollapsable = isCollapsable;
  };

  checkOverflow = () => {
    if (this.isCollapsable && this.containerRef) {
      setTimeout(() => {
        if (!this.isCollapsed) {
          if (this.containerRef.scrollWidth > this.containerRef.clientWidth) {
            this.toggleIsCollapsed(true);
          }
        } else {
          const totalWidth = this.tags.reduce(
            (acc, { ref }) => acc + (ref ? ref.offsetWidth + 8 : 0),
            0
          );

          if (totalWidth < this.containerRef.clientWidth) {
            this.toggleIsCollapsed(false);
          }
        }
      });
    }
  };

  toggleIsCollapsed = (isCollapsed: boolean) => {
    this.isCollapsed = isCollapsed;
  }

  focus = (corner: 'first' | 'last') => {
    if (this.isCollapsed && !this.isCollapseOpen) {
      this.collapseRef?.focus();
    } else {
      const index = corner === 'first' ? 0 : this.tags.length - 1;
      const tag = this.tags[index];

      this.focusTag(tag);
    }
  };

  setTagRef = (button: HTMLButtonElement, id: string) => {
    const tag = this.tags.find((tag) => tag.id === id);

    if (tag) {
      tag.ref = button;
    }
  };

  setContainerRef = (ref: HTMLDivElement) => {
    this.containerRef = ref;
  };

  setCollapseRef = (button: HTMLButtonElement) => {
    this.collapseRef = button;
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

    if (this.tags.length === 0) {
      this.toggleIsCollapsed(false);
      this.isCollapseOpen = false;
    }
  };

  addTag = (tag: TaskTag) => {
    this.tags.push(tag);

    if (!this.isCollapsed) {
      this.checkOverflow();
    }
  };

  createNewTag = () => {
    if (!this.hasTag && !this.currentTagMatch) {
      const id = uuidv4();
      const newTag = { title: this.trimmedStrValue, id };

      this.addTag(newTag);
      this.root.resources.tags.add(newTag);
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
    if (this.trimmedStrValue !== this.startSymbol || this.filteredTags.length) {
      if (
        index === 0 &&
        !this.currentTagMatch &&
        !this.hasTag &&
        this.trimmedStrValue !== this.startSymbol
      ) {
        this.createNewTag();
        return;
      }

      if (!this.hasTag || index > 0) {
        const hasFirstItem =
          (!this.currentTagMatch || this.hasTag) &&
          this.trimmedStrValue !== this.startSymbol;

        this.addAvailableTag(
          this.filteredTags[hasFirstItem ? index - 1 : index].id
        );
      }
    }
  };

  handleInput = (value: string) => {
    this.strValue = value;
  };

  handleCollapseOpen = () => {
    this.isCollapseOpen = true;

    setTimeout(() => this.focus('first'), 100);
  };

  handleCollapseClose = () => {
    this.isCollapseOpen = false;
  };

  handleCollapseButtonKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      this.callbacks.onFocusLeave(NavigationDirections.LEFT);
    } else if (e.key === 'ArrowRight') {
      this.callbacks.onFocusLeave(NavigationDirections.RIGHT);
    } else if (e.key === 'ArrowDown') {
      e.stopPropagation();

      if (!this.isCollapseOpen) {
        this.isCollapseOpen = true;
      }

      setTimeout(() => this.focus('first'));
    } else if (e.key === 'ArrowUp') {
      e.stopPropagation();

      if (!this.isCollapseOpen) {
        this.isCollapseOpen = false;
      }
    }
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
    } else if (
      (!this.isCollapseOpen && e.key === 'ArrowLeft') ||
      (this.isCollapseOpen && e.key === 'ArrowUp')
    ) {
      e.preventDefault();
      e.stopPropagation();
      const index = this.tags.findIndex((tag) => tag.id === id);

      if (index === 0) {
        if (this.isCollapseOpen) {
          this.collapseRef?.focus();
          this.isCollapseOpen = false;
        } else {
          this.callbacks.onFocusLeave(NavigationDirections.LEFT);
        }
      } else {
        const nextTag = this.tags[index - 1];

        if (nextTag) {
          this.focusTag(nextTag);
        } else {
          this.callbacks.onFocusLeave(NavigationDirections.LEFT);
        }
      }
    } else if (
      (!this.isCollapseOpen && e.key === 'ArrowRight') ||
      (this.isCollapseOpen && e.key === 'ArrowDown')
    ) {
      e.preventDefault();
      e.stopPropagation();
      const index = this.tags.findIndex((tag) => tag.id === id);
      const nextTag = this.tags[index + 1];

      if (nextTag) {
        this.focusTag(nextTag);
      } else {
        if (this.isCollapseOpen) {
          this.collapseRef?.focus();
          this.isCollapseOpen = false;
        } else {
          this.callbacks.onFocusLeave(NavigationDirections.RIGHT);
        }
      }
    } else if (e.key === 'Escape' && this.isCollapsed) {
      e.preventDefault();
      e.stopPropagation();
      this.handleCollapseClose();
      this.collapseRef?.focus();
    }
  };
}
