import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { EmojiStore } from "../../../stores/EmojiStore";
import { EmojiSelectCallbacks, EmojiSelectProps } from "./types";

export class EmojiSelectStore {
  icon: string;
  color: string;
  title: string;
  disabled: boolean = false;
  callbacks: EmojiSelectCallbacks;

  isEmojiPickerOpen = false;

  keymap = {
    CLOSE: 'escape',
  };

  hotkeysHandlers = {
    CLOSE: (e) => {
      e.stopPropagation();
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

  init = async () => {
    await EmojiStore.loadIfNotLoaded();
  }

  update = ({ icon, color, title, disabled, onColorChange, onIconChange, onToggleOpen }: EmojiSelectProps) => {
    this.icon = icon;
    this.color = color;
    this.title = title;
    this.disabled = disabled;

    this.callbacks = {
      onColorChange,
      onIconChange,
      onToggleOpen,
    };
  };
}

export const {
  StoreProvider: EmojiSelectStoreProvider,
  useStore: useEmojiSelectStore,
} = getProvider(EmojiSelectStore);
