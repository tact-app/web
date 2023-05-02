import { IconDefinition } from "@fortawesome/pro-solid-svg-icons";
import { NavigationDirections } from "../../../types/navigation";
import { ButtonProps } from "@chakra-ui/react";
import { ReactNode, KeyboardEvent } from 'react';
import { ActionMenuStore } from './store';

export type ActionMenuItem = {
  onClick(): void;
  command?: string;
  hotkey?: string | string[];
  title: ReactNode;
  hidden?: boolean;
  icon: IconDefinition;
  iconFontSize?: number;
  iconColor?: string;
  key?: string;
};

export type ActionMenuViewProps = {
  hidden?: boolean;
  triggerIconFontSize?: number;
  triggerIcon?: IconDefinition;
  menuMinWidth?: number;
  triggerButtonProps?(isOpen: boolean): ButtonProps;
  customTrigger?(isOpen: boolean): ReactNode;
};

export type ActionMenuCallbacks = {
  onNavigate?(direction: NavigationDirections, event: KeyboardEvent): void;
  onToggleMenu?(isOpen: boolean): void;
};

export type ActionMenuProps =  ActionMenuViewProps & ActionMenuCallbacks & {
  items: ActionMenuItem[];
  xPosContextMenu?: number;
  isOpenByContextMenu?: boolean;
  isMenuOpen?: boolean;
  instance?: ActionMenuStore;
};
