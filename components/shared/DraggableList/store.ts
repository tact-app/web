import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';
import { NavigationDirections } from '../../pages/Inbox/store/types';
import { ReactComponent } from 'react-hotkeys';

export type DraggableListCallbacks = {
  onItemsRemove?: (items: string[], ids: string[]) => void;
  onFocusLeave?: (direction: NavigationDirections) => void;
  onItemSecondClick?: (id: string) => void;
  onFocusedItemsChange?: (ids: string[]) => void;
  onOrderChange?: (items: string[], changedIds: string[], destinationIndex: number) => void;
  onEscape?: () => boolean;
  onVerifyDelete?: (ids: string[], cb: () => void) => void;
}

export type DraggableListComponentProps = {
  prefix?: ReactComponent;
  dragHandler?: ReactComponent;
  content: ReactComponent;
}

export type DraggableListProps = {
  callbacks?: DraggableListCallbacks;
  items: string[];
};

export class DraggableListStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  callbacks: DraggableListCallbacks = {};

  focusedItemIds: string[] = [];
  items: string[] = [];

  isItemMenuOpen: boolean = false;
  isDraggingActive: boolean = false;
  isControlDraggingActive: boolean = false;

  DnDApi = null;
  dropTimeout: null | number = null;
  currentSelectItemCursor: number = 0;

  get focused() {
    return this.focusedItemIds;
  }

  getHandler = (fn: (e) => void) => (e) => {
    if (!this.isItemMenuOpen && !this.isDraggingActive && !this.isControlDraggingActive) {
      fn(e);
    }
  };

  hotkeyHandlers = {
    UP: this.getHandler(() => this.handleNavigation(NavigationDirections.UP)),
    DOWN: this.getHandler(() => this.handleNavigation(NavigationDirections.DOWN)),
    DELETE: this.getHandler(() => {
      if (this.focusedItemIds.length) {
        const itemsForDelete = this.focusedItemIds.slice();

        this.callbacks.onVerifyDelete?.(itemsForDelete, () => {
          this.focusNextItem(itemsForDelete);
          this.deleteItems(itemsForDelete);
        });
      }
    }),
    FORCE_DELETE: this.getHandler(() => {
      if (this.focusedItemIds.length) {
        const itemsForDelete = this.focusedItemIds.slice();

        this.focusNextItem(itemsForDelete);
        this.deleteItems(itemsForDelete);
      }
    }),
    MOVE_UP: this.getHandler(() => {
      if (this.focusedItemIds.length) {
        if (this.focusedItemIds.length === 1) {
          this.runControlsMoveAction((lift) => lift.moveUp());
        } else {
          this.controlsMultiMoveAction('up');
        }
      }
    }),
    MOVE_DOWN: this.getHandler(() => {
      if (this.focusedItemIds.length) {
        if (this.focusedItemIds.length === 1) {
          this.runControlsMoveAction((lift) => lift.moveDown());
        } else {
          this.controlsMultiMoveAction('down');
        }
      }
    }),
    SELECT_UP: this.getHandler(() => this.shiftSelect('up')),
    SELECT_DOWN: this.getHandler(() => this.shiftSelect('down')),
    ESC: this.getHandler(() => {
      if (this.callbacks.onEscape?.()) {
        this.resetFocusedItem();
      }
    }),
  };

  shiftSelect = (direction: 'up' | 'down', count: number = 1) => {
    if (this.focusedItemIds.length) {
      const isUp = direction === 'up';

      if (isUp ? this.currentSelectItemCursor >= 0 : this.currentSelectItemCursor <= 0) {
        const focusedItemIndex = this.items.indexOf(this.focusedItemIds[isUp ? 0 : this.focusedItemIds.length - 1]);
        const nextFocusedItemIds = this.items.slice(
          focusedItemIndex + (isUp ? -count : 1),
          focusedItemIndex + (isUp ? 0 : count + 1)
        );

        if (nextFocusedItemIds.length) {
          this.currentSelectItemCursor += isUp ? 1 : -1;

          this.addFocusedItems(nextFocusedItemIds);
        }
      } else {
        if (this.currentSelectItemCursor > 0) {
          this.currentSelectItemCursor -= count;
          this.focusedItemIds = this.focusedItemIds.slice(count);
        } else {
          this.currentSelectItemCursor += count;
          this.focusedItemIds = this.focusedItemIds.slice(0, -count);
        }
      }
    }
  };

  runControlsMoveAction = (action: (lift) => void) => {
    if (this.isDraggingActive || this.isControlDraggingActive || this.dropTimeout) {
      return null;
    }

    const preDrag = this.DnDApi.tryGetLock(this.focusedItemIds[0], () => {
    });

    this.isControlDraggingActive = true;

    const lift = preDrag.snapLift();

    action(lift);

    this.dropTimeout = setTimeout(() => {
      lift.drop();
      this.dropTimeout = null;
    }, 200) as unknown as number;
  };

  controlsMultiMoveAction = (direction: 'up' | 'down') => {
    const mainSelectedItemId = this.focusedItemIds[0];
    const destinationIndex = this.items.indexOf(mainSelectedItemId) + (direction === 'up' ? -1 : 1);

    this.items = this.items.filter((id) => !this.focusedItemIds.includes(id));
    this.items.splice(destinationIndex, 0, ...this.focusedItemIds);

    this.callbacks.onOrderChange?.(this.items, this.focusedItemIds, destinationIndex);
  };

  setDnDApi = (api) => {
    this.DnDApi = api;
  };

  startDragging = () => {
    this.isDraggingActive = true;
  };

  endDragging = (result) => {
    this.isDraggingActive = false;
    this.isControlDraggingActive = false;

    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    this.items = [...this.items];
    const [removed] = this.items.splice(result.source.index, 1);
    this.items.splice(result.destination.index, 0, removed);

    this.callbacks.onOrderChange?.(this.items, [removed], result.destination.index);
  };

  deleteItems = (ids: string[]) => {
    this.items = this.items.filter((id) => !ids.includes(id));
    this.callbacks.onItemsRemove?.(this.items, ids);
  };

  handleNavigation = (direction: NavigationDirections) => {
    const focusedItemIndex = direction === NavigationDirections.UP ? 0 : this.focusedItemIds.length - 1;
    const index = this.focusedItemIds.length ? this.items.indexOf(this.focusedItemIds[focusedItemIndex]) : -1;

    this.resetFocusedItem();

    if (index !== -1) {
      if (direction === NavigationDirections.UP) {
        if (index !== 0) {
          this.setFocusedItem(this.items[index - 1]);
        } else {
          this.callbacks.onFocusLeave?.(NavigationDirections.UP);
        }
      } else if (direction === NavigationDirections.DOWN) {
        if (index !== this.items.length - 1) {
          this.setFocusedItem(this.items[index + 1]);
        } else {
          this.callbacks.onFocusLeave?.(NavigationDirections.DOWN);
        }
      }
    } else {
      if (direction === NavigationDirections.DOWN) {
        this.setFocusedItem(this.items[0]);
      } else {
        this.setFocusedItem(this.items[this.items.length - 1]);
      }
    }
  };

  resetFocusedItem = () => {
    this.focusedItemIds = [];
    this.currentSelectItemCursor = 0;
    this.callbacks.onFocusedItemsChange?.([]);
  };

  focusFirstItem = () => {
    this.setFocusedItem(this.items[0]);
  };

  focusNextItem = (ids: string[]) => {
    const itemIndex = ids.length === 1 ? this.items.indexOf(ids[0]) : -1;
    const nextItemId = itemIndex !== -1 && itemIndex !== this.items.length - 1 ? this.items[itemIndex + 1] : null;

    if (nextItemId !== null) {
      this.setFocusedItem(nextItemId);
    }
  }

  setFocusedItem = (id: string, mode?: 'single' | 'many') => {
    if (this.focusedItemIds.length === 1 && this.focusedItemIds[0] === id) {
      this.callbacks.onItemSecondClick?.(id);
    } else if (!mode) {
      this.resetFocusedItem();
      this.addFocusedItems([id]);
    } else if (mode === 'single') {
      if (this.focusedItemIds.includes(id)) {
        this.focusedItemIds = this.focusedItemIds.filter((ItemId) => ItemId !== id);

        if (this.currentSelectItemCursor !== 0) {
          if (this.currentSelectItemCursor > 0) {
            this.currentSelectItemCursor--;
          } else {
            this.currentSelectItemCursor++;
          }
        }
      } else {
        this.addFocusedItems([id]);

        if (this.currentSelectItemCursor !== 0) {
          if (this.currentSelectItemCursor < 0) {
            this.currentSelectItemCursor--;
          } else {
            this.currentSelectItemCursor++;
          }
        }
      }
    } else if (mode === 'many' && this.focusedItemIds.length && !this.focusedItemIds.includes(id)) {
      const topFocusedItemIndex = this.items.indexOf(this.focusedItemIds[0]);
      const bottomFocusedItemIndex = this.items.indexOf(this.focusedItemIds[this.focusedItemIds.length - 1]);
      const index = this.items.indexOf(id);

      if (index > bottomFocusedItemIndex) {
        this.shiftSelect('down', index - bottomFocusedItemIndex);
      } else if (index < topFocusedItemIndex) {
        this.shiftSelect('up', topFocusedItemIndex - index);
      }
    }
  };

  addFocusedItems = (ItemIds: string[]) => {
    this.focusedItemIds.push(...ItemIds);
    this.focusedItemIds.sort((a, b) => this.items.indexOf(a) - this.items.indexOf(b));

    this.callbacks.onFocusedItemsChange?.(ItemIds);
  };

  init = (props: DraggableListProps) => {
    this.callbacks = props.callbacks || {};
    this.items = props.items;
  };
}

export const {
  StoreProvider: DraggableListStoreProvider,
  useStore: useDraggableListStore,
} = getProvider(DraggableListStore);