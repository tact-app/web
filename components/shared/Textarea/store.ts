import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { Validator } from '../../../helpers/Validator';
import { NavigationDirections } from '../../../types/navigation';
import { FocusEvent, KeyboardEvent } from 'react';
import { TextareaCallbacks, TextareaStoreProps } from './types';
import { NavigationHelper } from '../../../helpers/NavigationHelper';

export class TextareaStore {
  value: string = '';
  maxLength?: number;
  error?: string;

  isFocused: boolean = false;
  textareaRef?: HTMLTextAreaElement;

  validator = new Validator();
  callbacks: TextareaCallbacks;

  constructor() {
    makeAutoObservable(this);
  }

  get borderColor() {
    if (this.isFocused) {
      return 'blue.400';
    }

    if (this.error) {
      return 'red.400';
    }

    return 'gray.200';
  }

  setTextareaRef = (el: HTMLTextAreaElement) => {
    this.textareaRef = el;
  };

  handleFocus = () => {
    this.textareaRef?.focus();
  };

  handleTextareaFocus = (e: FocusEvent<HTMLTextAreaElement, Element>) => {
    this.callbacks?.onFocus?.(e);
    this.isFocused = true;
  };

  handleTextareaBlur = (e: FocusEvent<HTMLTextAreaElement, Element>) => {
    this.callbacks?.onBlur?.(e);
    this.isFocused = false;
  };

  handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();

    this.callbacks?.onKeyDown?.(e);

    const currentValueLength = this.value.length;

    const direction = NavigationHelper.castKeyToDirection(e.key, e.shiftKey);

    if ([NavigationDirections.INVARIANT, NavigationDirections.TAB, NavigationDirections.BACK].includes(direction)) {
      this.textareaRef?.blur();
      this.callbacks?.onNavigate?.(direction, e);
    } else if (
      (
        [NavigationDirections.RIGHT, NavigationDirections.DOWN].includes(direction) && (
          !this.textareaRef.selectionStart ||
          this.textareaRef.selectionStart === currentValueLength
        )
      ) ||
      (
        [NavigationDirections.UP, NavigationDirections.LEFT].includes(direction) &&
        !this.textareaRef.selectionStart
      )
    ) {
      this.textareaRef.setSelectionRange(currentValueLength, currentValueLength);
      this.callbacks?.onNavigate?.(direction, e);
    }
  };

  update = ({
    maxLength,
    value,
    onFocus,
    onBlur,
    onKeyDown,
    onNavigate,
    error,
  }: TextareaStoreProps) => {
    this.value = String(value);
    this.maxLength = maxLength;
    this.error = error;

    this.callbacks = {
      onFocus,
      onBlur,
      onKeyDown,
      onNavigate,
    };
  };
}

export const {
  StoreProvider: TextareaStoreProvider,
  useStore: useTextareaStore,
} = getProvider(TextareaStore);
