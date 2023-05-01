import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from "../../../helpers/StoreProvider";
import { ListNavigation } from "../../../helpers/ListNavigation";
import { ActionMenuCallbacks, ActionMenuItem, ActionMenuProps } from "./types";
import { SyntheticEvent } from 'react';

export class ActionMenuStore {
  items: ActionMenuItem[];
  callbacks: ActionMenuCallbacks;
  xPosContextMenu?: number;
  isOpenByContextMenu?: boolean;

  isMenuOpen = false;

  menuNavigation = new ListNavigation();

  constructor(public root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.menuNavigation.disable();
  }

  preventEventsPropagation = (e: SyntheticEvent | KeyboardEvent) => {
    e.stopPropagation();
  };

  openMenu = () => {
    this.isMenuOpen = true;
    this.callbacks?.onToggleMenu?.(true);

    this.menuNavigation.enable();
  };

  closeMenu = () => {
    this.isMenuOpen = false;
    this.callbacks?.onToggleMenu?.(false);

    this.menuNavigation.disable();
  };

  update({ items, xPosContextMenu, onNavigate, onToggleMenu, isMenuOpen, isOpenByContextMenu }: ActionMenuProps) {
    this.items = items;
    this.xPosContextMenu = xPosContextMenu;
    this.isOpenByContextMenu = isOpenByContextMenu;
    this.isMenuOpen = Boolean(isMenuOpen ?? this.isMenuOpen);
    this.callbacks = {
      onNavigate,
      onToggleMenu,
    };
  };
}

export const {
  useStore: useActionMenuStore,
  StoreProvider: ActionMenuStoreProvider
} = getProvider(ActionMenuStore);
