import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';

export interface MainMenuItemParams {
  label: string;
  icon?: IconDefinition;
  subLabel?: string;
  children?: Array<MainMenuItemParams>;
  hotkey?: () => string;
  element?: 'a' | 'next-link';
  href?: string;
}
