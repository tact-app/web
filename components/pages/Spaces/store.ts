import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { SpaceData, SpacesFocusableBlocks, SpacesInboxItemData } from './types';
import {
  SpacesInboxItemProps,
  SpacesInboxItemStore,
} from './components/SpacesInboxItem/store';
import { RootStore } from '../../../stores/RootStore';
import { SpacesModals } from './modals/store';
import {
  SpacesMenuProps,
  SpacesMenuStore,
} from './components/SpacesMenu/store';
import {
  SpacesInboxProps,
  SpacesInboxStore,
} from './components/SpacesInbox/store';
import { TaskProps } from '../../shared/Task/store';
import { getStubItems } from './modals/SpaceCreationModal/stubs';
import { getNewConnect } from './modals/SpaceConnectAppsModal/stubs';
import { NavigationDirections } from '../../../types/navigation';

export type SpacesProps = {};

export class SpacesStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  modals = new SpacesModals(this.root);
  menu = new SpacesMenuStore(this.root);
  inboxItem = new SpacesInboxItemStore(this.root);
  inbox = new SpacesInboxStore(this.root);
  focusedBlockId: SpacesFocusableBlocks | null = SpacesFocusableBlocks.INBOX;

  currentSpace: SpaceData | null = null;
  selectedSpaceId: string | undefined = this.root.router.query.path
    ? (this.root.router.query.path[0] as string)
    : undefined;
  selectedPath: string[] = this.root.router.query.path
    ? (this.root.router.query.path.slice(1) as string[])
    : [];

  openedItem: SpacesInboxItemData | null = null;
  expandedBlocks: number[] = [];
  inboxItemExpanded = false;

  resizableConfig = [
    {
      width: 288,
      size: 0,
    },
    {
      size: 1,
      flexible: true,
      minWidth: 300,
    },
    {
      size: 1,
      minWidth: 300,
    },
    {
      size: 1,
      minWidth: 300,
    },
  ];

  get focusedBlock() {
    return this.modals.controller.isOpen ? null : this.focusedBlockId;
  }

  get isInboxItemExpanded() {
    return this.resizableConfig.every(({ size }, index) => {
      return (index === 2 && size === 1) || (index !== 2 && size === 0);
    });
  }

  get isInboxItemTaskExpanded() {
    return this.resizableConfig.every(({ size }, index) => {
      return (index === 3 && size === 1) || (index !== 3 && size === 0);
    });
  }

  setCurrentSpace = (space: SpaceData) => {
    if (this.currentSpace?.id !== space.id && this.currentSpace) {
      window.history.pushState(null, 'Inbox', `/inbox/${space.id}`);
    }

    this.currentSpace = space;
  };

  setSelectedPath = (path: string[]) => {
    if (this.selectedPath !== path) {
      window.history.pushState(
        null,
        'Inbox',
        `/inbox/${this.currentSpace?.id}/${path.join('/')}`
      );
    }

    this.selectedPath = path;
  };

  setOpenedItem = (item: SpacesInboxItemData | null) => {
    if (item && this.openedItem === null) {
      this.menu.toggleExpanded(false);
    }

    if (this.openedItem && item && this.openedItem.id === item.id) {
      this.focusedBlockId = SpacesFocusableBlocks.INBOX_ITEM;
      this.inboxItem.listWithCreator.creator.setFocus(true);
    }

    if (item === null && this.openedItem) {
      this.resetExpanded();
      this.inboxItem.listWithCreator.list.closeTask();
    }

    this.openedItem = item;
  };

  handleExpand = (indexes: number[]) => {
    this.expandedBlocks = indexes;

    if (indexes.length === 1 && indexes[0] === 2) {
      this.inboxItemExpanded = true;
    }

    this.resizableConfig.forEach((conf, i) => {
      conf.size = i === 0 || (indexes.length && !indexes.includes(i)) ? 0 : 1;
    });
  };

  resetExpanded = () => {
    this.inboxItemExpanded = false;
    this.handleExpand([1, 2, 3]);
  };

  handleMenuExpand = () => {
    this.resizableConfig[0].width = 288;
    this.resizableConfig = [...this.resizableConfig];
  };

  handleMenuCollapse = () => {
    this.resizableConfig[0].width = 56;
    this.resizableConfig = [...this.resizableConfig];
  };

  handleFocusLeave = (direction: NavigationDirections) => {
    this.resetExpanded();

    if (this.focusedBlockId === SpacesFocusableBlocks.TREE) {
      this.focusedBlockId = SpacesFocusableBlocks.INBOX;
      this.inboxItem.listWithCreator.list.draggableList.focusFirstItem();
    } else if (this.focusedBlockId === SpacesFocusableBlocks.INBOX) {
      if (direction === NavigationDirections.LEFT) {
        this.inboxItem.listWithCreator.list.draggableList.resetFocusedItem();
        this.focusedBlockId = SpacesFocusableBlocks.TREE;
      } else if (this.openedItem) {
        this.focusedBlockId = SpacesFocusableBlocks.INBOX_ITEM;
        this.inboxItem.listWithCreator.creator.setFocus(true);
      }
    } else if (this.focusedBlockId === SpacesFocusableBlocks.INBOX_ITEM) {
      if (
        direction === NavigationDirections.LEFT ||
        direction === NavigationDirections.INVARIANT
      ) {
        this.inboxItem.listWithCreator.list.draggableList.resetFocusedItem();
        this.focusedBlockId = SpacesFocusableBlocks.INBOX;
      }
    }

    return true;
  };

  handleFocus = (block: SpacesFocusableBlocks) => {
    this.focusedBlockId = block;
  };

  handleSpaceChange = (space: SpaceData) => {
    this.setCurrentSpace(space);
  };

  handlePathSelect = (path: string[]) => {
    this.setSelectedPath(path);
  };

  handleSpaceCreationClick = () => {
    this.modals.openSpaceCreationModal(this.menu.handleSpaceUpdate, this.handleSpaceAddOriginClick);
  };

  handleSpaceSettingsClick = (space) => {
    this.modals.openSpaceSettingsModal(
      space,
      this.menu.handleSpaceUpdate,
      this.menu.handleSpaceDelete
    );
  };

  handleConnectApp = (space: SpaceData) => (app: string) => {
    space.children.push(getNewConnect(space.id, app));
    this.root.resources.spaces.update(space);
    this.menu.loadSpaces();
  }

  handleSpaceAddOriginClick = (space) => {
    this.modals.openSpaceСonnectionsModal(space, this.handleConnectApp);
  };

  getInboxItems = async () => {
    if (this.currentSpace.id !== 'all') {
      return getStubItems([this.currentSpace.id, ...this.selectedPath]);
    } else {
      return getStubItems();
    }
  };

  update = () => null;

  menuCallbacks: SpacesMenuProps['callbacks'] = {
    onSpaceChange: this.handleSpaceChange,
    onPathChange: this.handlePathSelect,
    onFocus: () => this.handleFocus(SpacesFocusableBlocks.TREE),
    onFocusLeave: () => this.handleFocusLeave(NavigationDirections.RIGHT),
    onSpaceCreationClick: this.handleSpaceCreationClick,
    onSpaceSettingsClick: this.handleSpaceSettingsClick,
    onSpaceOriginAddClick: this.handleSpaceAddOriginClick,
    onExpand: this.handleMenuExpand,
    onCollapse: this.handleMenuCollapse,
  };

  inboxCallbacks: SpacesInboxProps['callbacks'] = {
    onFocus: () => this.handleFocus(SpacesFocusableBlocks.INBOX),
    onFocusLeave: this.handleFocusLeave,
    onSelect: (item) => this.setOpenedItem(item),
    onPathChange: this.handlePathSelect,
  };

  itemCallbacks: SpacesInboxItemProps['callbacks'] = {
    onExpand: () => {
      this.inboxItem.listWithCreator.list.closeTask();
      this.handleExpand([2]);
    },
    onCollapse: () => this.resetExpanded(),
    onClose: () => this.setOpenedItem(null),
    onFocusLeave: this.handleFocusLeave,
    onFocus: () => this.handleFocus(SpacesFocusableBlocks.INBOX_ITEM),
    onPreviousItem: () => {
      this.inbox.navigate('up');
      this.inbox.selectFocusedItem();
    },
    onNextItem: () => {
      this.inbox.navigate('down');
      this.inbox.selectFocusedItem();
    },
    onOpenTask: (hasOpenedTask) => {
      if (this.inboxItemExpanded) {
        this.handleExpand([2, 3]);
      } else {
        this.resetExpanded();
      }
    },
    onCloseTask: () => {
      if (this.inboxItemExpanded) {
        this.handleExpand([2]);
      } else {
        this.resetExpanded();
      }
    },
  };

  taskCallbacks: TaskProps['callbacks'] = {
    ...this.inboxItem.listWithCreator.list.taskCallbacks,
    onFocus: () => this.handleFocus(SpacesFocusableBlocks.INBOX_ITEM),
    onExpand: () => this.handleExpand([3]),
    onCollapse: () => this.resetExpanded(),
  };
}

export const { StoreProvider: SpacesStoreProvider, useStore: useSpacesStore } =
  getProvider(SpacesStore);
