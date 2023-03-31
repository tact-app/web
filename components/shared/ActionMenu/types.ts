import { IconDefinition } from "@fortawesome/pro-solid-svg-icons";
import { NavigationDirections } from "../../../types/navigation";
import { ButtonProps } from "@chakra-ui/react";

export type ActionMenuItem = {
  onClick(): void;
  command?: string;
  hotkey?: string | string[];
  title: string;
  hidden?: boolean;
  icon: IconDefinition;
};

export type ActionMenuViewProps = {
  isMenuOpen?: boolean;
  hidden?: boolean;
  triggerIconFontSize?: number;
  triggerIcon?: IconDefinition;
  isOpenByContextMenu?: boolean;
  triggerButtonProps?(isOpen: boolean): ButtonProps;
};

export type ActionMenuCallbacks = {
  onNavigate?(direction: NavigationDirections): void;
  onToggleMenu?(isOpen: boolean): void;
};

export type ActionMenuProps =  ActionMenuViewProps & ActionMenuCallbacks & {
  items: ActionMenuItem[];
};
