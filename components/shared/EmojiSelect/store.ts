import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { EmojiStore } from "../../../stores/EmojiStore";
import { EmojiSelectCallbacks, EmojiSelectProps } from "./types";

export class EmojiSelectStore {
  icon: string;
  color: string;
  title: string;
  callbacks: EmojiSelectCallbacks;

  isEmojiPickerOpen = false;

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
    this.isEmojiPickerOpen = true;
  };

  closeEmojiPicker = () => {
    this.isEmojiPickerOpen = false;
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

  update = ({ icon, color, title, onColorChange, onIconChange }: EmojiSelectProps) => {
    this.icon = icon;
    this.color = color;
    this.title = title;

    this.callbacks = {
      onColorChange,
      onIconChange,
    };
  };
}

export const {
  StoreProvider: EmojiSelectStoreProvider,
  useStore: useEmojiSelectStore,
} = getProvider(EmojiSelectStore);