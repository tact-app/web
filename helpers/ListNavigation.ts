import { makeAutoObservable } from 'mobx';
import { useHotkeysHandler } from './useHotkeysHandler';
import {
  HotkeysEvent,
} from 'react-hotkeys-hook/src/types';
import { useEffect } from 'react';

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export type NavigationCallbacks = {
  onForceEnter?: () => void;
  onEnter?: () => void;
  onNumber?: (number: number) => void;
  onFocused?: () => void;
};

const defaultCallbacks: NavigationCallbacks = {};

export const useListNavigation = (listNavigation: ListNavigation,
  storeKeyMap?: Record<string, string[] | string>,
  storeHotkeyHandlers?: Record<string, (event: KeyboardEvent, handler: HotkeysEvent) => void
  >) => {
  useEffect(() => {
    listNavigation.init();
  }, [listNavigation]);

  return useHotkeysHandler(
    { ...listNavigation.keyMap, ...(storeKeyMap || {}) },
    { ...listNavigation.hotkeyHandlers, ...(storeHotkeyHandlers || {}) },
    { enabled: listNavigation.isEnabled }
  );
};

export class ListNavigation {
  constructor(public callbacks: NavigationCallbacks = defaultCallbacks) {
    makeAutoObservable(this);
  }

  isEnabled = true;
  savedRefs: HTMLElement[] = [];
  focusedIndex: number | null = 0;

  keyMap = {
    UP: ['up', 'j'],
    DOWN: ['down', 'k'],
    ENTER: ['enter'],
    FORCE_ENTER: ['meta+enter'],
    FIRST: ['meta+up', 'meta+j', 'h'],
    LAST: ['meta+down', 'meta+k', 'l'],
    NUMBERS: numbers,
  };

  hotkeyHandlers = {
    UP: (e) => {
      e.preventDefault();

      if (this.focusedIndex !== null) {
        const nextIndex = this.focusedIndex - 1;

        if (nextIndex < 0) {
          this.setFocusedIndex(this.refs.length - 1);
        } else {
          this.setFocusedIndex(nextIndex);
        }
      } else {
        this.setFocusedIndex(this.refs.length - 1);
      }
    },
    DOWN: (e) => {
      e.preventDefault();

      if (this.focusedIndex !== null) {
        const nextIndex = this.focusedIndex + 1;

        if (nextIndex >= this.refs.length) {
          this.setFocusedIndex(0);
        } else {
          this.setFocusedIndex(nextIndex);
        }
      } else {
        this.setFocusedIndex(0);
      }
    },
    ENTER: (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (this.callbacks.onEnter) {
        this.callbacks.onEnter();
      } else if (this.focusedIndex !== null) {
        this.refs[this.focusedIndex]?.click();
      }
    },
    FORCE_ENTER: (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.callbacks.onForceEnter?.();
    },
    LAST: (e) => {
      e.preventDefault();

      this.setFocusedIndex(this.refs.length - 1);
    },
    FIRST: (e) => {
      e.preventDefault();

      this.setFocusedIndex(0);
    },
    NUMBERS: (e) => {
      e.preventDefault();

      const index = parseInt(e.key) - 1;

      if (index === this.focusedIndex) {
        this.refs[this.focusedIndex].click();
      } else if (index < this.refs.length) {
        this.setFocusedIndex(index);
        this.refs[this.focusedIndex].click();
        this.callbacks.onNumber?.(index);
      }
    },
  };

  get refs() {
    return this.savedRefs.filter(Boolean);
  }

  disable = () => {
    this.isEnabled = false;
  };

  enable = () => {
    this.isEnabled = true;
  };

  setRefs = (index: number, ref: HTMLElement) => {
    this.savedRefs[index] = ref;
  };

  setFocusedIndex = (index: number | null) => {
    this.focusedIndex = index;

    if (index !== null) {
      this.refs[index]?.focus();
    }
  };

  handleFocus = (e) => {
    const index = this.refs.indexOf(e.target);

    if (index !== -1) {
      this.setFocusedIndex(index);
    } else {
      this.setFocusedIndex(null);
    }

    this.callbacks.onFocused?.();
  };

  reset = () => {
    this.setFocusedIndex(null);
  };

  focus = () => {
    this.setFocusedIndex(0);
  };

  init = () => {
    setTimeout(() => {
      this.setFocusedIndex(0);
    });
  };
}
