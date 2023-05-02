import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { EmojiStore } from '../../../stores/EmojiStore';
import { EmojiSelectCallbacks, EmojiSelectProps } from './types';
import { NavigationDirections } from '../../../types/navigation';
import { KeyboardEvent, SyntheticEvent } from 'react';
import { NavigationHelper } from '../../../helpers/NavigationHelper';

export class EmojiSelectStore {
  icon: string;
  color: string;
  title: string;
  disabled: boolean = false;
  callbacks: EmojiSelectCallbacks;

  isEmojiPickerOpen = false;

  triggerRef: HTMLButtonElement;

  keymap = {
    CLOSE: 'escape',
  };

  hotkeysHandlers = {
    CLOSE: (e: KeyboardEvent) => {
      this.preventPropagation(e);
      this.closeEmojiPicker();
    },
  };

  constructor() {
    makeAutoObservable(this);
  }

  get triggerContent() {
    return this.icon || this.title?.[0];
  }

  get mainColor() {
    const [color, modifier] = this.color.split('.');

    return {
      color,
      modifier: Number(modifier ?? 0),
    };
  }

  preventPropagation(e: SyntheticEvent | KeyboardEvent) {
    e.stopPropagation();
  }

  openEmojiPicker = () => {
    if (this.disabled) {
      return;
    }

    this.isEmojiPickerOpen = true;
    this.callbacks?.onToggleOpen?.(true);
  };

  closeEmojiPicker = () => {
    this.isEmojiPickerOpen = false;
    this.callbacks?.onToggleOpen?.(false);
  };

  handleEmojiSelect = (emoji: { native: string }) => {
    this.callbacks?.onIconChange?.(emoji.native);
  };

  handleEmojiRemove = () => {
    this.callbacks?.onIconChange?.('');
  };

  handleColorSelect = (color: string) => {
    this.callbacks?.onColorChange?.(color);
  };

  handleContainerKeyDown = (e: KeyboardEvent) => {
    this.preventPropagation(e);

    if (e.key === 'Escape' && this.isEmojiPickerOpen) {
      this.closeEmojiPicker();
      this.triggerRef.focus();
    }
  };

  handleKeyDown = (event: KeyboardEvent) => {
    if (this.isEmojiPickerOpen) {
      return;
    }

    const direction = NavigationHelper.castKeyToDirection(event.key, event.shiftKey);

    if (!direction) {
      return;
    }

    if (direction === NavigationDirections.INVARIANT) {
      this.triggerRef.blur();
    }

    this.callbacks?.onNavigate?.(direction, event);
  };

  setRef = (element: HTMLButtonElement) => {
    this.triggerRef = element;
  };

  init = async () => {
    await EmojiStore.loadIfNotLoaded();
  };

  update = ({
    icon,
    color,
    title,
    disabled,
    onColorChange,
    onIconChange,
    onToggleOpen,
    onFocus,
    onBlur,
    onNavigate,
  }: EmojiSelectProps) => {
    this.icon = icon;
    this.color = color;
    this.title = title;
    this.disabled = disabled;

    this.callbacks = {
      onColorChange,
      onIconChange,
      onToggleOpen,
      onFocus,
      onBlur,
      onNavigate,
    };
  };
}

export const {
  StoreProvider: EmojiSelectStoreProvider,
  useStore: useEmojiSelectStore,
} = getProvider(EmojiSelectStore);
