import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { BlockTypesOption } from '../../types';

export type DescriptionEditorCreateMenuProps = {
  items: BlockTypesOption[]
  onSelect?: (item: BlockTypesOption) => void;
  onClose?: () => void;
  command?: (item: BlockTypesOption) => void;
}

export class DescriptionEditorCreateMenuStore {
  constructor() {
    makeAutoObservable(this);
  }

  onSelect: (item: BlockTypesOption) => void;
  command: (item: BlockTypesOption) => void;
  onClose: () => void;

  isOpen: boolean = false;
  selectedIndex: number = 0;
  items: any[] = [];

  onKeyDown = ({ event }) => {
    if (event.key === 'ArrowUp') {
      this.upHandler();
      return true;
    }

    if (event.key === 'ArrowDown') {
      this.downHandler();
      return true;
    }

    if (event.key === 'Enter') {
      this.enterHandler();
      return true;
    }

    if (event.key === 'Esc') {
      this.onClose?.();
      return true;
    }

    return false;
  };

  handleClose = () => {
    this.isOpen = false;
    this.onClose?.();
  }

  handleOpen = () => {
    this.isOpen = true;
  }

  upHandler = () => {
    this.selectedIndex =
      (this.selectedIndex + this.items.length - 1) %
      this.items.length;
  };

  downHandler = () => {
    this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
  };

  enterHandler = () => {
    this.selectItem(this.selectedIndex);
  };

  selectItem = (index) => {
    const item = this.items[index];

    if (item) {
      this.command?.(item);
      this.onSelect?.(item);
    }
  };

  init = (props: DescriptionEditorCreateMenuProps) => {
    if (this.items !== props.items) {
      this.selectedIndex = 0;
    }

    this.items = props.items;
    this.onSelect = props.onSelect;
    this.onClose = props.onClose;
    this.command = props.command;
  };
}

export const {
  StoreProvider: DescriptionEditorCreateMenuStoreProvider,
  useStore: useDescriptionEditorCreateMenuStore,
} = getProvider(DescriptionEditorCreateMenuStore);