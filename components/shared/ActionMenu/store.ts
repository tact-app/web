import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from "../../../helpers/StoreProvider";
import { ListNavigation } from "../../../helpers/ListNavigation";
import { ActionMenuCallbacks, ActionMenuItem, ActionMenuProps } from "./types";

export class ActionMenuStore {
  items: ActionMenuItem[];
  callbacks: ActionMenuCallbacks;

  isMenuOpen = false;

  menuNavigation = new ListNavigation();

  constructor(public root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  toggleMenu = () => {
    this.isMenuOpen = !this.isMenuOpen;
    this.callbacks?.onToggleMenu?.(this.isMenuOpen);
  };

  openMenu = () => {
    this.isMenuOpen = true;
    this.callbacks?.onToggleMenu?.(true);
  };

  closeMenu = () => {
    this.isMenuOpen = false;
    this.callbacks?.onToggleMenu?.(false);
  };

  update({ items, onNavigate, onToggleMenu, isMenuOpen }: ActionMenuProps) {
    this.items = items;
    this.isMenuOpen = isMenuOpen;
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
