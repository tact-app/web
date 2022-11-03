import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { SpaceData, SpacesFocusableBlocks } from './types';
import { SpacesInboxItemData } from './components/SpacesInbox/types';
import { SpacesMenuStore } from './components/SpacesMenu/store';
import { SpacesInboxItemStore } from './components/SpacesInboxItem/store';
import { RootStore } from '../../../stores/RootStore';

export type SpacesProps = {};

export class SpacesStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  menu = new SpacesMenuStore();
  inboxItem = new SpacesInboxItemStore(this.root);

  focusedBlock: SpacesFocusableBlocks | null = SpacesFocusableBlocks.TREE;

  currentSpace: SpaceData | null = null;
  focusedPath: string[] = [];

  openedItem: SpacesInboxItemData | null = null;

  setCurrentSpace = (space: SpaceData) => {
    this.currentSpace = space;
  };

  setFocusedPath = (path: string[]) => {
    this.focusedPath = path;
  };

  setOpenedItem = (item: SpacesInboxItemData | null) => {
    if (item && this.openedItem === null) {
      this.menu.toggleExpanded(false);
    }

    if (this.openedItem && item && this.openedItem.id === item.id) {
      this.focusedBlock = SpacesFocusableBlocks.INBOX_ITEM;
      this.inboxItem.list.creator.setFocus(true);
    }

    this.openedItem = item;
  };

  handleFocusLeave = (direction: 'left' | 'right') => {
    if (this.focusedBlock === SpacesFocusableBlocks.TREE) {
      this.focusedBlock = SpacesFocusableBlocks.INBOX;
    } else if (this.focusedBlock === SpacesFocusableBlocks.INBOX) {
      if (direction === 'left') {
        this.focusedBlock = SpacesFocusableBlocks.TREE;
      } else if (this.openedItem) {
        this.focusedBlock = SpacesFocusableBlocks.INBOX_ITEM;
        this.inboxItem.list.creator.setFocus(true);
      }
    } else if (this.focusedBlock === SpacesFocusableBlocks.INBOX_ITEM) {
      if (direction === 'left') {
        this.focusedBlock = SpacesFocusableBlocks.INBOX;
      }
    }
  };

  handleFocus = (block: SpacesFocusableBlocks) => {
    this.focusedBlock = block;
  };

  handleSpaceChange = (space: SpaceData) => {
    this.setCurrentSpace(space);
  };

  handleFocusChange = (path: string[]) => {
    this.setFocusedPath(path);
  };

  init = (props: SpacesProps) => null;

  update = () => null;
}

export const { StoreProvider: SpacesStoreProvider, useStore: useSpacesStore } =
  getProvider(SpacesStore);
