export type EmojiSelectViewProps = {
  size?: number;
  iconFontSize?: string;
  borderRadius?: string | number;
  canRemoveEmoji?: boolean;
};

export type EmojiSelectCallbacks = {
  onToggleOpen?(isOpen: boolean): void;
  onColorChange?(color: string): void;
  onIconChange?(icon: string): void;
};

export type EmojiSelectProps = EmojiSelectViewProps & EmojiSelectCallbacks & {
  icon: string;
  color: string;
  title?: string;
};
