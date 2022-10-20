import { ReactElement } from 'react';

export interface NavItem {
  label: string;
  icon?: ReactElement;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}
