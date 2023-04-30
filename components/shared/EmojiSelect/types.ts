import { Property } from "csstype";
import { NavigationDirections } from '../../../types/navigation';

export type EmojiSelectViewProps = {
  size?: number;
  iconFontSize?: string;
  borderRadius?: string | number;
  canRemoveEmoji?: boolean;
  cursor?: Property.Cursor;
  tabIndex?: number;
};

export type EmojiSelectCallbacks = {
  onToggleOpen?(isOpen: boolean): void;
  onColorChange?(color: string): void;
  onIconChange?(icon: string): void;
  onFocus?(): void;
  onBlur?(): void;
  onNavigate?(direction: NavigationDirections): void;
};

export type EmojiSelectProps = EmojiSelectViewProps & EmojiSelectCallbacks & {
  icon: string;
  color: string;
  title?: string;
  disabled?: boolean;
};
