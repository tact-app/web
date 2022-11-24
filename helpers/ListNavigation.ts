import { KeyboardEvent } from 'react';
import { makeAutoObservable } from 'mobx';

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

export type NavigationCallbacks = {
  onForceEnter?: () => void;
  onEnter?: () => void;
  onNumber?: (number: number) => void;
};

const defaultCallbacks: NavigationCallbacks = {};

export class ListNavigation {
  constructor(public callbacks: NavigationCallbacks = defaultCallbacks) {
    makeAutoObservable(this);
  }

  savedRefs: HTMLElement[] = [];
  focusedIndex: number | null = null;

  get refs() {
    return this.savedRefs.filter(Boolean);
  }

  setRefs = (index: number, ref: HTMLElement) => {
    this.savedRefs[index] = ref;

    if (index === 0 && ref && this.focusedIndex === null) {
      this.setFocusedIndex(0);
      ref.focus();
    }
  };

  setFocusedIndex = (index: number | null) => {
    this.focusedIndex = index;

    if (index !== null) {
      this.refs[index]?.focus();
    }
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'k') {
      e.preventDefault();

      if (e.metaKey || e.ctrlKey) {
        this.setFocusedIndex(this.refs.length - 1);
      } else if (this.focusedIndex !== null) {
        const nextIndex = this.focusedIndex + 1;

        if (nextIndex >= this.refs.length) {
          this.setFocusedIndex(0);
        }

        this.setFocusedIndex(nextIndex);
      } else {
        this.setFocusedIndex(0);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'j') {
      e.preventDefault();

      if (e.metaKey || e.ctrlKey) {
        this.setFocusedIndex(0);
      } else if (this.focusedIndex !== null) {
        const nextIndex = this.focusedIndex - 1;

        if (nextIndex < 0) {
          this.setFocusedIndex(this.refs.length - 1);
        }

        this.setFocusedIndex(nextIndex);
      } else {
        this.setFocusedIndex(this.refs.length - 1);
      }
    } else if (e.key === 'l') {
      e.preventDefault();

      this.setFocusedIndex(this.refs.length - 1);
    } else if (numbers.includes(e.key)) {
      e.preventDefault();

      const index = parseInt(e.key) - 1;

      if (index === this.focusedIndex) {
        this.refs[this.focusedIndex].click();
      } else if (index < this.refs.length) {
        this.setFocusedIndex(index);
        this.callbacks.onNumber?.(index);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();

      if (e.metaKey || e.ctrlKey) {
        this.callbacks.onForceEnter?.();
      } else {
        if (this.callbacks.onEnter) {
          this.callbacks.onEnter();
        } else if (this.focusedIndex !== null) {
          this.refs[this.focusedIndex].click();
        }
      }
    }
  };

  handleFocus = (e) => {
    const index = this.refs.indexOf(e.target);

    if (index !== -1) {
      this.setFocusedIndex(index);
    } else {
      this.setFocusedIndex(null);
    }
  };

  reset = () => {
    this.setFocusedIndex(null);
  };

  focus = (index: number) => {
    if (index !== null) {
      this.refs[index].focus();
    }

    this.setFocusedIndex(index);
  };

  init = () => {
    const ref = this.refs[this.focusedIndex];

    if (ref) {
      ref.focus();
    }
  };
}
