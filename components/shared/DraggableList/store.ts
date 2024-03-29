import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';
import { NavigationDirections } from '../../../types/navigation';
import React from 'react';

export type DraggableListCallbacks = {
  onItemsRemove?: (items: string[], ids: string[]) => void;
  onFocusLeave?: (direction: NavigationDirections) => void;
  onItemSecondClick?: (id: string) => void;
  onFocusedItemsChange?: (ids: string[]) => void;
  onOrderChange?: (
    items: string[],
    changedIds: string[],
    destinationIndex: number
  ) => void;
  onEscape?: () => boolean;
  onVerifyDelete?: (ids: string[], cb: () => void) => void;
};

export type DraggableListComponentInnerProps = {
  id: string;
  provided?: any;
  snapshot?: any;
  isFocused?: boolean;
};

export type DraggableListComponentProps = {
  prefix?: React.FC<DraggableListComponentInnerProps>;
  dragHandler?: React.FC<DraggableListComponentInnerProps>;
  content: React.FC<DraggableListComponentInnerProps>;
};

export type DraggableListProps = {
  id: string;
  callbacks?: DraggableListCallbacks;
  checkItemActivity?: (id: string) => boolean;
  isHotkeysEnabled?: boolean;
  items: string[];
  dndActive?: boolean;
};

export class DraggableListStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  callbacks: DraggableListCallbacks = {};
  checkItemActivity?: (id: string) => boolean;

  id: string = '';
  lastFocusedItemId: string | null = null;
  savedFocusedItemIds: string[] = [];
  focusedItemIds: string[] = [];
  baseFocusedItem: number = null;
  items: string[] = [];
  isMouseSelection: boolean = false

  isDndActive: boolean = true;
  isForceHotkeysActive: boolean = true;
  isDraggingActive: boolean = false;
  isControlDraggingActive: boolean = false;

  focusedRef: HTMLElement | null = null;

  DnDApi = null;
  dropTimeout: null | number = null;
  currentSelectItemCursor: number = 0;

  get activeItems() {
    if (this.checkItemActivity) {
      return this.items.filter(this.checkItemActivity);
    } else {
      return this.items;
    }
  }

  get focused() {
    return this.focusedItemIds;
  }

  get isHotkeysActive() {
    return (
      !this.isDraggingActive &&
      !this.isControlDraggingActive &&
      this.isForceHotkeysActive &&
      !this.root.isModalOpen
    );
  }

  get hasSavedFocusedItems() {
    return this.savedFocusedItemIds.length > 0;
  }

  keymap = {
    UP: ['j', 'up'],
    DOWN: ['k', 'down'],
    FORCE_UP: ['meta+j', 'meta+up', 'h'],
    FORCE_DOWN: ['meta+k', 'meta+down', 'l'],
    EDIT: 'space',
    MOVE_UP: [
      'ctrl+shift+j',
      'ctrl+shift+up'
    ],
    MOVE_DOWN: [
      'ctrl+shift+k',
      'ctrl+shift+down',
    ],
    SELECT_UP: ['shift+j', 'shift+up'],
    SELECT_DOWN: ['shift+k', 'shift+down'],
    SELECT_ALL: ['meta+a'],
    ESC: 'escape',
    FORCE_DELETE: [
      'meta+backspace',
      'meta+delete'
    ],
    DELETE: ['del', 'backspace'],
  };

  arrowSelect = (direction: 'up' | 'down') => {
    const isUp = direction === 'up';
    if (
      isUp
        ? this.currentSelectItemCursor >= 0
        : this.currentSelectItemCursor <= 0
    ) {
      this.shiftSelect(direction)
    } else {
      if (this.currentSelectItemCursor > 0) {
        this.currentSelectItemCursor--;
        this.focusedItemIds = this.focusedItemIds.slice(1);
        this.lastFocusedItemId = this.focusedItemIds[0];
      } else {
        this.currentSelectItemCursor++;
        this.focusedItemIds = this.focusedItemIds.slice(0, -1);
        this.lastFocusedItemId =
          this.focusedItemIds[this.focusedItemIds.length - 1];
      }
    }
  };

  get hasFocusableItems() {
    return this.activeItems.length > 0;
  }

  shiftSelect = (direction: 'up' | 'down', count: number = 1) => {
    if (this.focusedItemIds.length) {
      const isUp = direction === 'up';

      const focusedItemIndex = this.activeItems.indexOf(
        this.focusedItemIds[isUp ? 0 : this.focusedItemIds.length - 1]
      );
      const nextFocusedItemIds = this.activeItems.slice(
        focusedItemIndex + (isUp ? -count : 1),
        focusedItemIndex + (isUp ? 0 : count + 1)
      );

      if (nextFocusedItemIds.length) {
        this.currentSelectItemCursor += isUp ? 1 : -1;
        this.addFocusedItems(nextFocusedItemIds);
      }
    }
  };

  finishMouseSelect = (items, { shiftKey }) => {
    this.isMouseSelection = false
    if (!items.length && !this.focusedItemIds.length) {
      return;
    }

    if (!shiftKey) {
      this.resetFocusedItem();
    }
    this.focusedItemIds = items
      .filter(item => !this.focusedItemIds.includes(item))
      .concat(this.focusedItemIds.filter(item => !items.includes(item)));
  }

  starthMouseSelect = () => {
    this.isMouseSelection = true
  }

  restoreSavedFocusedItems = () => {
    this.resetFocusedItem();

    if (this.savedFocusedItemIds.length) {
      this.addFocusedItems(this.savedFocusedItemIds);
    } else {
      this.focusFirstItem();
    }

    this.resetSavedFocusedItems();
  };

  selectAll = () => {
    this.resetFocusedItem();
    this.addFocusedItems(this.activeItems);
  };

  runControlsMoveAction = (action: (lift) => void) => {
    if (
      this.isDraggingActive ||
      this.isControlDraggingActive ||
      this.dropTimeout
    ) {
      return null;
    }

    const preDrag = this.DnDApi.tryGetLock(this.focusedItemIds[0], () => { });

    if (preDrag) {
      this.isControlDraggingActive = true;

      const lift = preDrag.snapLift();

      action(lift);

      this.dropTimeout = setTimeout(() => {
        lift.drop();
        this.dropTimeout = null;
      }, 200) as unknown as number;
    }
  };

  controlsMultiMoveAction = (direction: 'up' | 'down') => {
    const mainSelectedItemId = this.focusedItemIds[0];
    const destinationIndex =
      this.items.indexOf(mainSelectedItemId) + (direction === 'up' ? -1 : 1);
    const boundedDestinationIndex = Math.min(
      this.items.length - 1,
      Math.max(0, destinationIndex)
    );

    this.items = this.items.filter((id) => !this.focusedItemIds.includes(id));
    this.items.splice(boundedDestinationIndex, 0, ...this.focusedItemIds);

    this.callbacks.onOrderChange?.(
      this.items,
      this.focusedItemIds,
      boundedDestinationIndex
    );
  };

  setDnDApi = (api) => {
    this.DnDApi = api;
  };

  startDragging = () => {
    this.isDraggingActive = true;
  };

  get sensors() {
    return [this.setDnDApi];
  }

  endDragging = (result?: any) => {
    this.isDraggingActive = false;
    this.isControlDraggingActive = false;

    if (!result?.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    this.items = [...this.items];
    const [removed] = this.items.splice(result.source.index, 1);
    this.items.splice(result.destination.index, 0, removed);

    this.callbacks.onOrderChange?.(
      this.items,
      [removed],
      result.destination.index
    );
  };

  deleteItems = (ids: string[]) => {
    this.items = this.items.filter((id) => !ids.includes(id));
    this.callbacks.onItemsRemove?.(this.items, ids);
  };

  handleNavigation = (direction: NavigationDirections) => {
    if (this.activeItems.length) {
      const focusedItemIndex =
        direction === NavigationDirections.UP
          ? 0
          : this.focusedItemIds.length - 1;
      const index = this.focusedItemIds.length
        ? this.items.indexOf(this.focusedItemIds[focusedItemIndex])
        : -1;

      this.resetFocusedItem();

      if (index !== -1) {
        if (direction === NavigationDirections.UP) {
          this.focusPrevItem(this.items[index]);
        } else if (direction === NavigationDirections.DOWN) {
          this.focusNextItem(this.items[index]);
        }
      } else {
        if (direction === NavigationDirections.DOWN) {
          this.focusFirstItem();
        } else if (direction === NavigationDirections.UP) {
          this.focusLastItem();
        }
      }

      return true;
    } else {
      return false;
    }
  };

  leaveFocus = (direction: NavigationDirections) => {
    this.resetFocusedItem();
    this.callbacks.onFocusLeave?.(direction);
    this.callbacks.onFocusedItemsChange?.(this.focusedItemIds);
  };

  resetFocusedItem = () => {
    this.focusedItemIds = [];
    this.currentSelectItemCursor = 0;
  };

  revalidateFocusedItems = () => {
    this.focusedItemIds = this.focusedItemIds.filter(this.checkItemActivity);
    this.callbacks.onFocusedItemsChange?.(this.focusedItemIds);
  };

  getFirstActiveItem = () => {
    if (this.checkItemActivity) {
      return this.items.find((id) => this.checkItemActivity(id)) || null;
    } else {
      return this.items[0];
    }
  };

  getLastActiveItem = () => {
    if (this.checkItemActivity) {
      return (
        [...this.items].reverse().find((id) => this.checkItemActivity(id)) ||
        null
      );
    } else {
      return this.items[this.items.length - 1];
    }
  };

  getNextActiveItem = (id: string) => {
    const index = this.items.indexOf(id);

    if (this.checkItemActivity) {
      return (
        this.items.slice(index + 1).find((id) => this.checkItemActivity(id)) ||
        null
      );
    } else {
      return this.items[index + 1] || null;
    }
  };

  getPrevActiveItem = (id: string) => {
    const index = this.items.indexOf(id);

    if (this.checkItemActivity) {
      return (
        this.items
          .slice(0, index)
          .reverse()
          .find((id) => this.checkItemActivity(id)) || null
      );
    } else {
      return this.items[index - 1] || null;
    }
  };

  isAlreadySingleFocused = (id: string) => {
    return this.focusedItemIds.length === 1 && this.focusedItemIds.includes(id);
  };

  hasNextTask(taskId: string) {
    const index = this.activeItems.indexOf(taskId) + 1;

    return index < this.activeItems.length;
  }

  hasPrevTask(taskId: string) {
    const index = this.activeItems.indexOf(taskId) - 1;

    return this.activeItems.length > 1 && index >= 0;
  }

  focusNextItem = (id: string, stay?: boolean) => {
    const nextActiveItem = this.getNextActiveItem(id);

    if (nextActiveItem) {
      this.setFocusedItem(nextActiveItem);
    } else if (!stay) {
      this.leaveFocus(NavigationDirections.DOWN);
    }
  };

  focusNextWithFilter = (filter: (id: string) => boolean) => {
    this.focusNextItemWithFilter(
      this.focusedItemIds[this.focusedItemIds.length - 1],
      filter
    );
  };

  focusNextItemWithFilter = (id: string, filter: (id: string) => boolean) => {
    const index = this.items.indexOf(id);

    const item = this.items
      .slice(index + 1)
      .concat(this.items.slice(0, index))
      .find(
        (id) =>
          (!this.checkItemActivity || this.checkItemActivity(id)) && filter(id)
      );

    if (item) {
      this.setFocusedItem(item);
    }
  };

  focusPrevItem = (id: string, stay?: boolean) => {
    const prevActiveItem = this.getPrevActiveItem(id);

    if (prevActiveItem) {
      this.setFocusedItem(prevActiveItem);
    } else if (!stay) {
      this.leaveFocus(NavigationDirections.UP);
    }
  };

  focusFirstItem = () => {
    this.setFocusedItem(this.getFirstActiveItem());
  };

  focusLastItem = () => {
    this.setFocusedItem(this.getLastActiveItem());
  };

  focusAfterItems = (ids: string[]) => {
    const lastItemIndex = ids.reduce((index, id) => {
      const currentIndex = this.items.indexOf(id);

      if (currentIndex > index) {
        return currentIndex;
      } else {
        return index;
      }
    }, -1);

    const item =
      this.items
        .slice(lastItemIndex + 1)
        .concat(this.items.slice(0, lastItemIndex))
        .find((id) => !this.checkItemActivity || this.checkItemActivity(id)) ||
      null;

    if (item !== null) {
      this.setFocusedItem(item);
    }
  };

  setFocusedRef = (ref: HTMLElement) => {
    if (ref && this.focusedRef !== ref) {
      this.focusedRef = ref;

      setTimeout(() => {
        ref.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 100);
    }
  };

  saveFocusedItems = () => {
    this.savedFocusedItemIds = [...this.focusedItemIds];
  };

  setFocusedItems = (ids: string[]) => {
    if (!ids.length) {
      this.focusFirstItem();
    }

    this.addFocusedItems(ids);
    this.resetSavedFocusedItems();
  };

  resetSavedFocusedItems = () => {
    this.savedFocusedItemIds = [];
  };

  setFocusedItem = (id: string, mode?: 'single' | 'many') => {
    this.resetSavedFocusedItems();

    if (this.focusedItemIds.length === 1 && this.focusedItemIds[0] === id) {
      this.callbacks.onItemSecondClick?.(id);
    } else if (!mode) {
      this.resetFocusedItem();
      this.addFocusedItems([id]);
      this.baseFocusedItem = this.items.indexOf(id)

    } else if (mode === 'single') {
      if (!this.focusedItemIds.includes(id)) {
        this.baseFocusedItem = this.items.indexOf(id)
      }

      if (this.focusedItemIds.includes(id)) {
        this.focusedItemIds = this.focusedItemIds.filter(
          (ItemId) => ItemId !== id
        );
      } else {
        this.addFocusedItems([id]);
      }
    } else if (
      mode === 'many' &&
      this.focusedItemIds.length
    ) {
      const topFocusedItemIndex = this.items.indexOf(this.focusedItemIds[0]);
      const bottomFocusedItemIndex = this.items.indexOf(
        this.focusedItemIds[this.focusedItemIds.length - 1]
      );
      const index = this.items.indexOf(id);
      const isSingleFocused = this.focusedItemIds.length === 1
      const isUpReverse = this.baseFocusedItem === topFocusedItemIndex && index < bottomFocusedItemIndex && index < topFocusedItemIndex
      const isDownReverse = this.baseFocusedItem === bottomFocusedItemIndex && index > bottomFocusedItemIndex && index > topFocusedItemIndex
      this.focusedItemIds = [this.items[this.baseFocusedItem]]

      if (!isSingleFocused && isDownReverse) {
        this.shiftSelect('down', index - bottomFocusedItemIndex);
      } else if (!isSingleFocused && isUpReverse) {
        this.shiftSelect('up', topFocusedItemIndex - index);
      } else if (index > this.baseFocusedItem) {
        this.shiftSelect('down', index - this.baseFocusedItem);
      } else if (index < this.baseFocusedItem) {
        this.shiftSelect('up', this.baseFocusedItem - index);
      }
    }
  };

  hotkeyHandlers = {
    UP: (e) => {
      e.preventDefault();
      this.handleNavigation(NavigationDirections.UP);
    },
    DOWN: (e) => {
      e.preventDefault();
      this.handleNavigation(NavigationDirections.DOWN);
    },
    FORCE_DOWN: (e) => {
      e.preventDefault();
      const lastItem = this.getLastActiveItem();

      if (!this.isAlreadySingleFocused(lastItem)) {
        this.setFocusedItem(lastItem);
      }
    },
    FORCE_UP: (e) => {
      e.preventDefault();
      const firstItem = this.getFirstActiveItem();

      if (!this.isAlreadySingleFocused(firstItem)) {
        this.setFocusedItem(firstItem);
      }
    },
    DELETE: () => {
      if (this.focusedItemIds.length) {
        const itemsForDelete = this.focusedItemIds.slice();

        this.callbacks.onVerifyDelete?.(itemsForDelete, () => {
          this.focusAfterItems(itemsForDelete);
          this.deleteItems(itemsForDelete);
        });
      }
    },
    FORCE_DELETE: () => {
      if (this.focusedItemIds.length) {
        const itemsForDelete = this.focusedItemIds.slice();

        this.focusAfterItems(itemsForDelete);
        this.deleteItems(itemsForDelete);
      }
    },
    MOVE_UP: (e) => {
      e.preventDefault();

      if (this.focusedItemIds.length) {
        if (this.focusedItemIds.length === 1) {
          this.runControlsMoveAction((lift) => lift.moveUp());
        } else {
          this.controlsMultiMoveAction('up');
        }
      }
    },
    MOVE_DOWN: (e) => {
      e.preventDefault();

      if (this.focusedItemIds.length) {
        if (this.focusedItemIds.length === 1) {
          this.runControlsMoveAction((lift) => lift.moveDown());
        } else {
          this.controlsMultiMoveAction('down');
        }
      }
    },
    SELECT_UP: () => this.arrowSelect('up'),
    SELECT_DOWN: () => this.arrowSelect('down'),
    SELECT_ALL: (e) => {
      e.preventDefault();
      this.selectAll();
    },
    ESC: () => {
      if (!this.callbacks.onEscape?.()) {
        this.resetFocusedItem();
        this.callbacks.onFocusedItemsChange?.([]);
      }
    },
  };

  addFocusedItems = (itemIds: string[]) => {
    const activeItemIds = this.checkItemActivity
      ? itemIds.filter((id) => this.checkItemActivity(id))
      : itemIds;

    this.focusedItemIds.push(...activeItemIds);
    this.focusedItemIds.sort(
      (a, b) => this.items.indexOf(a) - this.items.indexOf(b)
    );
    this.lastFocusedItemId = activeItemIds[activeItemIds.length - 1];

    this.callbacks.onFocusedItemsChange?.(activeItemIds);
  };

  update = (props: DraggableListProps) => {
    this.callbacks = props.callbacks || {};
    this.id = props.id;
    this.items = props.items;
    this.isDndActive = props.dndActive;
    this.isForceHotkeysActive = props.isHotkeysEnabled ?? true;
    this.checkItemActivity = props.checkItemActivity;
  };
}

export const {
  StoreProvider: DraggableListStoreProvider,
  useStore: useDraggableListStore,
} = getProvider(DraggableListStore);
