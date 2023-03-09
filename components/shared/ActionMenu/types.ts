import { IconDefinition } from "@fortawesome/pro-solid-svg-icons";
import { NavigationDirections } from "../../../types/navigation";
import { ButtonProps } from "@chakra-ui/react";

export type ActionMenuItem = {
  onClick(): void;
  command?: string;
  hotkey?: string;
  title: string;
  icon: IconDefinition;
};

export type ActionMenuViewProps = {
  hidden?: boolean;
  triggerIconFontSize?: number;
  triggerIcon?: IconDefinition;
  triggerButtonProps?(isOpen: boolean): ButtonProps;
};

export type ActionMenuProps =  ActionMenuViewProps & {
  onNavigate?(direction: NavigationDirections): void;
  onToggleMenu?(isOpen: boolean): void;
  items: ActionMenuItem[];
};
