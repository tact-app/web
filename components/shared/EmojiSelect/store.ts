import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { RootStore } from "../../../stores/RootStore";
import { EmojiStore } from "../../../stores/EmojiStore";

export type EmojiSelectProps = {
  icon: string;
  color: string;
  size?: number;
  iconFontSize?: string;
  onColorChange?(color: string): void;
  onIconChange?(icon: string): void;
};

export const EMOJI_SELECT_COLORS = [
  'red.200',
  'orange.100',
  'orange.200',
  'yellow.200',
  'green.200',
  'blue.200',
  'teal.200',
  'purple.200',
];

export class EmojiSelectStore {
  icon: string;
  color: string;
  onColorChange: EmojiSelectProps['onColorChange'];
  onIconChange: EmojiSelectProps['onIconChange'];

  isEmojiPickerOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  openEmojiPicker = () => {
    this.isEmojiPickerOpen = true;
  };

  closeEmojiPicker = () => {
    this.isEmojiPickerOpen = false;
  };

  handleEmojiSelect = (emoji: { native: string }) => {
    this.onIconChange(emoji.native);
  };

  handleColorSelect = (color: string) => {
    this.onColorChange(color);
  };

  init = async () => {
    await EmojiStore.loadIfNotLoaded();
  }

  update = ({ icon, color, onColorChange, onIconChange }: EmojiSelectProps) => {
    this.icon = icon;
    this.color = color;
    this.onIconChange = onIconChange;
    this.onColorChange = onColorChange;
  };
}

export const {
  StoreProvider: EmojiSelectStoreProvider,
  useStore: useEmojiSelectStore,
} = getProvider(EmojiSelectStore);
