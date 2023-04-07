import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { Validator } from "../../../helpers/Validator";
import { TextareaProps as ChakraTextareaProps } from "@chakra-ui/textarea/dist/textarea";
import { IconDefinition } from "@fortawesome/pro-solid-svg-icons";
import { NavigationDirections } from "../../../types/navigation";
import { FocusEvent, KeyboardEvent } from "react";

type TextareaParamsToExclude = 'onFocus' | 'onBlur' | 'onKeyDown' | 'maxLength' | 'value';
type TextareaCallbacks = Pick<ChakraTextareaProps, TextareaParamsToExclude> & {
  onNavigate?(direction: NavigationDirections): void;
};
type TextareaStoreProps = TextareaCallbacks & {
  error?: string;
  maxLength?: number;
};
type TextareaViewProps = Omit<ChakraTextareaProps, TextareaParamsToExclude> & {
  icon?: IconDefinition;
}
type TextareaProps = TextareaStoreProps & TextareaViewProps;

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
    this.callbacks?.onKeyDown?.(e);

    const currentValueLength = this.value.length;

    if (!this.textareaRef.selectionStart && e.key === 'ArrowUp') {
      this.textareaRef.setSelectionRange(currentValueLength, currentValueLength);
      this.callbacks?.onNavigate?.(NavigationDirections.UP);
    } else if (e.key === 'ArrowDown' && (
      !this.textareaRef.selectionStart ||
      this.textareaRef.selectionStart === currentValueLength
    )) {
      this.textareaRef.setSelectionRange(currentValueLength, currentValueLength);
      this.callbacks?.onNavigate?.(NavigationDirections.DOWN);
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
