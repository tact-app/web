import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from "../../../helpers/StoreProvider";
import { ListNavigation } from "../../../helpers/ListNavigation";
import { ActionMenuCallbacks, ActionMenuItem, ActionMenuProps } from "./types";

export class ActionMenuStore {
  items: ActionMenuItem[];
  callbacks: ActionMenuCallbacks;
  xPosContextMenu?: number;
  isOpenByContextMenu?: boolean;

  isMenuOpen = false;

  menuNavigation = new ListNavigation();

  constructor(public root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  openMenu = () => {
    this.isMenuOpen = true;
    this.callbacks?.onToggleMenu?.(true);
  };

  closeMenu = () => {
    this.isMenuOpen = false;
    this.callbacks?.onToggleMenu?.(false);
  };

  update({ items, xPosContextMenu, onNavigate, onToggleMenu, isMenuOpen, isOpenByContextMenu }: ActionMenuProps) {
    this.items = items;
    this.xPosContextMenu = xPosContextMenu;
    this.isOpenByContextMenu = isOpenByContextMenu;
    this.isMenuOpen = Boolean(isMenuOpen);
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
