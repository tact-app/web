import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { RootStore } from '../../../../../stores/RootStore';
import { SpaceData, SpacesInboxItemData } from '../../types';
import { NavigationDirections } from '../../../../shared/TasksList/types';

export type SpacesInboxProps = {
  space: SpaceData;
  selectedPath: string[];
  itemsLoader: () => Promise<SpacesInboxItemData[]>;
  callbacks: {
    onFocusLeave?: (direction: NavigationDirections) => void;
    onFocus?: () => void;
    onPathChange?: (path: string[]) => void;
    onSelect?: (item: SpacesInboxItemData) => void;
  };
  isHotkeysEnabled: boolean;
};

export class SpacesInboxStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  keyMap = {
    UP: 'arrowup',
    DOWN: 'arrowdown',
    LEAVE_LEFT: 'arrowleft',
    LEAVE_RIGHT: 'arrowright',
    SELECT: ['arrowright', 'enter'],
    UNSELECT: 'escape',
  };

  hotkeysHandlers = {
    UP: (e) => {
      e.preventDefault();
      this.navigate('up');
    },
    DOWN: (e) => {
      e.preventDefault();
      this.navigate('down');
    },
    LEAVE_LEFT: () => {
      this.callbacks.onFocusLeave?.(NavigationDirections.LEFT);
    },
    LEAVE_RIGHT: () => {
      this.selectFocusedItem();
      this.callbacks.onFocusLeave?.(NavigationDirections.RIGHT);
    },
    SELECT: () => this.selectFocusedItem(),
    UNSELECT: () => this.selectItem(null),
  };

  callbacks: SpacesInboxProps['callbacks'] = {};

  selectedPath: string[] = [];
  focusedItemId: string | null = null;
  focusedItemRef: HTMLElement | null = null;
  space: SpaceData | null = null;
  items: SpacesInboxItemData[] = [];
  itemsLoader: (() => Promise<SpacesInboxItemData[]>) | null = null;
  searchString: string = '';

  get filteredItems() {
    if (!this.searchString) {
      return this.items;
    }

    return this.items.filter((item) => {
      return item.title.toLowerCase().includes(this.searchString.toLowerCase());
    });
  }

  updateSearch(value: string) {
    this.searchString = value;
  }

  navigate = (direction: 'up' | 'down') => {
    const index = this.items.findIndex(
      (item) => item.id === this.focusedItemId
    );

    if (this.focusedItemId && index !== -1) {
      const nextIndex = direction === 'up' ? index - 1 : index + 1;
      const nextItem = this.items[nextIndex];

      if (nextItem) {
        this.focusedItemId = nextItem.id;
      }
    } else if (this.items.length) {
      if (direction === 'down') {
        this.focusedItemId = this.items[0].id;
      } else {
        this.focusedItemId = this.items[this.items.length - 1].id;
      }
    }
  };

  setFocusedItemRef = (ref: HTMLElement | null) => {
    if (ref && this.focusedItemRef !== ref) {
      this.focusedItemRef = ref;
      this.focusedItemRef.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  handleItemClick = (id: string | null) => {
    this.selectItem(id);
  };

  selectItem = (id: string | null) => {
    const item = this.items.find((item) => item.id === id);

    this.focusedItemId = id;
    this.callbacks.onSelect?.(item || null);
  };

  selectFocusedItem = () => {
    this.selectItem(this.focusedItemId);
  };

  loadItems = async () => {
    this.items = await this.itemsLoader();
  };

  goToSpace = () => {
    this.callbacks.onPathChange?.([]);
  };

  goToOrigin = (id: string) => {
    const index = this.selectedPath.findIndex((item) => item === id);

    this.callbacks.onPathChange?.(this.selectedPath.slice(0, index + 1));
  };

  update = (props: SpacesInboxProps) => {
    this.callbacks = props.callbacks;
    this.itemsLoader = props.itemsLoader;
    this.selectedPath = props.selectedPath;
    this.space = props.space;

    if (this.space) {
      this.loadItems();
    }
  };
}

export const {
  StoreProvider: SpacesInboxStoreProvider,
  useStore: useSpacesInboxStore,
} = getProvider(SpacesInboxStore);
