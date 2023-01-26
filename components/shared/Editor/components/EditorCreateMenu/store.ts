import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { BlockTypesOption } from '../../types';

export type EditorCreateMenuProps = {
  items: BlockTypesOption[];
  onSelect?: (item: BlockTypesOption) => void;
  onClose?: () => void;
  command?: (item: BlockTypesOption) => void;
};

export class EditorCreateMenuStore {
  constructor() {
    makeAutoObservable(this);
  }

  onSelect: (item: BlockTypesOption) => void;
  command: (item: BlockTypesOption) => void;
  onClose: () => void;

  isOpen: boolean = false;
  selectedIndex: number = 0;
  items: any[] = [];
  plainItems: any[] = [];

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

    return false;
  };

  getLocalIndex = (name: string, index: number) => {
    const sectionIndex = this.items.findIndex((item) => item.name === name);

    return (
      this.items
        .slice(0, sectionIndex)
        .reduce((acc, { options }) => acc + options.length, 0) + index
    );
  };

  getLocalIndexMatch = (name: string, index: number) => {
    return this.selectedIndex === this.getLocalIndex(name, index);
  };

  handleClose = () => {
    this.isOpen = false;
    this.onClose?.();
  };

  handleClickItem = (name: string, index: number) => {
    const resolvedIndex = this.getLocalIndex(name, index);

    this.selectItem(resolvedIndex);
  };

  handleOpen = () => {
    this.isOpen = true;
  };

  upHandler = () => {
    this.selectedIndex =
      (this.selectedIndex + this.plainItems.length - 1) %
      this.plainItems.length;
  };

  downHandler = () => {
    this.selectedIndex = (this.selectedIndex + 1) % this.plainItems.length;
  };

  enterHandler = () => {
    this.selectItem(this.selectedIndex);
  };

  selectItem = (index) => {
    const item = this.plainItems[index];

    if (item) {
      this.command?.(item);
      this.onSelect?.(item);
    }
  };

  update = (props: EditorCreateMenuProps) => {
    if (this.items !== props.items) {
      this.selectedIndex = 0;
    }

    this.items = props.items;
    this.plainItems = props.items.reduce(
      (acc, { options }) => [...acc, ...options],
      []
    );
    this.onSelect = props.onSelect;
    this.onClose = props.onClose;
    this.command = props.command;
  };
}

export const {
  StoreProvider: EditorCreateMenuStoreProvider,
  useStore: useEditorCreateMenuStore,
} = getProvider(EditorCreateMenuStore);
