import { Property } from "csstype";
import { NavigationDirections } from '../../../types/navigation';
import { KeyboardEvent } from 'react';

export type EmojiSelectViewProps = {
  size?: number;
  iconFontSize?: string;
  borderRadius?: string | number;
  canRemoveEmoji?: boolean;
  cursor?: Property.Cursor;
  tabIndex?: number;
  preventOnFocus?: boolean;
};

export type EmojiSelectCallbacks = {
  onToggleOpen?(isOpen: boolean): void;
  onColorChange?(color: string): void;
  onIconChange?(icon: string): void;
  onFocus?(): void;
  onBlur?(): void;
  onNavigate?(direction: NavigationDirections, event: KeyboardEvent): void;
};

export type EmojiSelectProps = EmojiSelectViewProps & EmojiSelectCallbacks & {
  icon: string;
  color: string;
  title?: string;
  disabled?: boolean;
};
