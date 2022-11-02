import { IconDefinition } from '@fortawesome/pro-regular-svg-icons';

export interface NavItem {
  label: string;
  icon?: IconDefinition;
  subLabel?: string;
  children?: Array<NavItem>;
  hotkey: string;
  href?: string;
}
