import { makeAutoObservable, toJS } from 'mobx';
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
import {
  getRandomOrigins,
  getStubItems,
} from './modals/SpaceCreationModal/stubs';

export type SpacesProps = {};

export class SpacesStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  modals = new SpacesModals(this.root);
  menu = new SpacesMenuStore(this.root);
  inboxItem = new SpacesInboxItemStore(this.root);
  inbox = new SpacesInboxStore(this.root);

  isTodayHelpOpen: boolean = false;
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

  toggleTodayHelp = () => {
    this.isTodayHelpOpen = !this.isTodayHelpOpen;
  };

  closeTodayHelp = () => {
    this.isTodayHelpOpen = false;
  };

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
      this.inboxItem.list.creator.setFocus(true);
    }

    if (item === null && this.openedItem) {
      this.resetExpanded();
      this.inboxItem.list.closeTask();
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

  handleFocusLeave = (direction: 'left' | 'right') => {
    this.resetExpanded();

    if (this.focusedBlockId === SpacesFocusableBlocks.TREE) {
      this.focusedBlockId = SpacesFocusableBlocks.INBOX;
    } else if (this.focusedBlockId === SpacesFocusableBlocks.INBOX) {
      if (direction === 'left') {
        this.focusedBlockId = SpacesFocusableBlocks.TREE;
      } else if (this.openedItem) {
        this.focusedBlockId = SpacesFocusableBlocks.INBOX_ITEM;
        this.inboxItem.list.creator.setFocus(true);
      }
    } else if (this.focusedBlockId === SpacesFocusableBlocks.INBOX_ITEM) {
      if (direction === 'left') {
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
    this.modals.openSpaceCreationModal(this.saveSpace);
  };

  handleSpaceSettingsClick = (space) => {
    this.modals.openSpaceSettingsModal(
      space,
      this.updateSpace,
      this.deleteSpace
    );
  };

  handleSpaceAddOriginClick = (space) => {
    space.children.push(getRandomOrigins(space.id, 1)[0]);

    this.menu.updateSpace(space);
    this.root.api.spaces.update({
      id: space.id,
      fields: {
        children: toJS(space.children),
      },
    });
  };

  saveSpace = (space: SpaceData) => {
    this.menu.addSpace(space);
    this.root.api.spaces.add(space);
  };

  updateSpace = (space: SpaceData) => {
    this.menu.updateSpace(space);
    this.root.api.spaces.update({
      id: space.id,
      fields: space,
    });
  };

  deleteSpace = (space: SpaceData) => {
    this.menu.deleteSpace(space.id);
    this.root.api.spaces.delete(space.id);
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
    onFocusLeave: () => this.handleFocusLeave('right'),
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
    onTodayHelpClick: this.toggleTodayHelp,
    onPathChange: this.handlePathSelect,
  };

  itemCallbacks: SpacesInboxItemProps['callbacks'] = {
    onExpand: () => {
      this.inboxItem.list.closeTask();
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
    ...this.inboxItem.list.taskCallbacks,
    onFocus: () => this.handleFocus(SpacesFocusableBlocks.INBOX_ITEM),
    onExpand: () => this.handleExpand([3]),
    onCollapse: () => this.resetExpanded(),
  };
}

export const { StoreProvider: SpacesStoreProvider, useStore: useSpacesStore } =
  getProvider(SpacesStore);
