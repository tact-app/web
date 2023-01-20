import { ResizableBlocksStore } from './index';
import { makeAutoObservable } from 'mobx';
import { ResizableBlocksItemPosData } from '../types';
import { NavigationDirections } from '../../../../../../shared/TasksList/types';

export class ResizableBlocksNavigation {
  constructor(public parent: ResizableBlocksStore) {
    makeAutoObservable(this);
  }

  keyMap = {
    RIGHT: 'right',
    LEFT: 'left',
    UP: 'up',
    DOWN: 'down',
    TAB: 'tab',
    SHIFT_TAB: 'shift+tab',
    ESC: 'escape',
    DELETE: ['delete', 'backspace'],
  };

  hotkeyHandlers = {
    RIGHT: (e) => {
      e.preventDefault();
      this.moveFocus(NavigationDirections.RIGHT);
    },
    LEFT: (e) => {
      e.preventDefault();
      this.moveFocus(NavigationDirections.LEFT);
    },
    UP: (e) => {
      e.preventDefault();
      this.moveFocus(NavigationDirections.UP);
    },
    DOWN: (e) => {
      e.preventDefault();
      this.moveFocus(NavigationDirections.DOWN);
    },
    ESCAPE: () => this.resetFocus(),
    DELETE: () => this.removeFocusedItem(),
  };

  focusedItem: {
    id: string;
    containerId: string;
  } | null = null;

  focusFirstItem() {
    const { itemsList } = this.parent;
    const firstItem = [...itemsList].sort((a, b) => a.start - b.start)[0];
    if(!firstItem) return
    const firstItemContainerId = this.parent.getItemContainerId(firstItem.id);

    if (firstItem) {
      this.setFocusedItem(firstItem.id, firstItemContainerId);
    }
  }

  setFocusedItem = (id: string, containerId: string) => {
    this.resetFocus();

    Object.values(this.parent.itemsPositions[id]).forEach((item) => {
      item.isFocused = true;
    });

    this.focusedItem = {
      id,
      containerId,
    };

    this.parent.callbacks.onFocusItem?.(id);
  };

  resetFocus = () => {
    if (this.focusedItem) {
      Object.values(this.parent.itemsPositions[this.focusedItem.id]).forEach(
        (item) => {
          item.isFocused = false;
        }
      );
    }

    this.focusedItem = null;
  };

  removeFocusedItem = () => {
    if (this.focusedItem) {
      const { id } = this.focusedItem;

      this.resetFocus();
      this.parent.removeItem(id);
    }
  };

  getNextContainer = (containerId: string) => {
    const index = this.parent.containersBounds.findIndex(
      ({ id }) => id === containerId
    );

    if (index === this.parent.containersBounds.length - 1) {
      return null;
    } else {
      return this.parent.containersBounds[index + 1].id;
    }
  };

  getPrevContainer = (containerId: string) => {
    const index = this.parent.containersBounds.findIndex(
      ({ id }) => id === containerId
    );

    if (index === 0) {
      return null;
    } else {
      return this.parent.containersBounds[index - 1].id;
    }
  };

  getHorizontalNeighborItems = (
    side: 'left' | 'right',
    currentItemPos: ResizableBlocksItemPosData,
    containerId: string
  ) => {
    const itemId = currentItemPos.id;
    const hasNeighboursInContainer =
      side === 'right'
        ? currentItemPos.toLevel < currentItemPos.totalLevels
        : currentItemPos.fromLevel > 0;
    const searchContainerId = hasNeighboursInContainer
      ? containerId
      : side === 'right'
      ? this.getNextContainer(containerId)
      : this.getPrevContainer(containerId);

    const searchContainer = this.parent.itemsByContainerId[searchContainerId];
    let result: ResizableBlocksItemPosData[] = [];

    if (searchContainer) {
      const containerItemsPos = searchContainer.map(
        (item) => this.parent.itemsPositions[item.id][searchContainerId]
      );

      if (hasNeighboursInContainer) {
        if (side === 'right') {
          result = containerItemsPos.filter(
            (itemPos) =>
              itemPos.fromLevel === currentItemPos.toLevel &&
              itemPos.totalLevels === currentItemPos.totalLevels
          );
        } else {
          result = containerItemsPos.filter(
            (itemPos) =>
              itemPos.toLevel === currentItemPos.fromLevel &&
              itemPos.totalLevels === currentItemPos.totalLevels
          );
        }
      } else {
        if (side === 'right') {
          result = containerItemsPos.filter(
            (itemPos) => itemPos.fromLevel === 0 && itemPos.id !== itemId
          );
        } else {
          result = containerItemsPos.filter(
            (itemPos) =>
              itemPos.toLevel === itemPos.totalLevels && itemPos.id !== itemId
          );
        }
      }
    }

    return {
      items: result,
      containerId: searchContainerId,
    };
  };

  getNextFocusedItemHorizontal = (side: 'left' | 'right') => {
    const focusedItemPos =
      this.parent.itemsPositions[this.focusedItem.id][
        this.focusedItem.containerId
      ];
    const focusedItemCenter = focusedItemPos.y + focusedItemPos.height / 2;

    const { items: neighborItems, containerId } =
      this.getHorizontalNeighborItems(
        side,
        focusedItemPos,
        this.focusedItem.containerId
      );

    const itemPos = neighborItems.sort((itemPosA, itemPosB) => {
      if (itemPosA.y === focusedItemPos.y) {
        return -1;
      }

      if (itemPosB.y === focusedItemPos.y) {
        return 1;
      }

      const itemAEnd = itemPosA.y + itemPosA.height;
      const itemBEnd = itemPosB.y + itemPosB.height;
      const itemATopDelta = Math.abs(itemPosA.y - focusedItemCenter);
      const itemABottomDelta = Math.abs(itemAEnd - focusedItemCenter);
      const itemBTopDelta = Math.abs(itemPosB.y - focusedItemCenter);
      const itemBBottomDelta = Math.abs(itemBEnd - focusedItemCenter);

      if (
        (itemATopDelta < itemBTopDelta && itemATopDelta < itemBBottomDelta) ||
        (itemABottomDelta < itemBTopDelta &&
          itemABottomDelta < itemBBottomDelta)
      ) {
        return -1;
      } else if (
        (itemBTopDelta < itemATopDelta && itemBTopDelta < itemABottomDelta) ||
        (itemBBottomDelta < itemATopDelta &&
          itemBBottomDelta < itemABottomDelta)
      ) {
        return 1;
      } else {
        return 0;
      }
    })[0];

    if (itemPos) {
      return {
        id: itemPos.id,
        containerId,
      };
    } else {
      return null;
    }
  };

  getNextFocusedItemVertical = (side: 'top' | 'bottom') => {
    let containerId = this.focusedItem.containerId;
    const itemId = this.focusedItem.id;

    const focusedItem = this.parent.items[itemId];
    const focusedItemPos = this.parent.itemsPositions[itemId][containerId];

    const focusedItemContainerItems =
      this.parent.itemsByContainerId[containerId];
    const focusedItemLevelCenter =
      focusedItemPos.fromLevel +
      (focusedItemPos.toLevel - focusedItemPos.fromLevel) / 2;
    const focusedItemRelativeCenter =
      focusedItemLevelCenter / focusedItemPos.totalLevels;

    const nearestItem = focusedItemContainerItems
      .filter((item) => {
        if (side === 'top') {
          return item.end <= focusedItem.start;
        } else {
          return item.start >= focusedItem.end;
        }
      })
      .map((item) => ({
        item,
        pos: this.parent.itemsPositions[item.id][containerId],
      }))
      .sort((itemA, itemB) => {
        let result: number;

        if (side === 'top') {
          result = itemB.item.end - itemA.item.end;
        } else {
          result = itemA.item.start - itemB.item.start;
        }

        if (result === 0) {
          if (focusedItemPos.totalLevels === 1) {
            return itemA.pos.fromLevel - itemB.pos.fromLevel;
          } else {
            const itemALevelCenter =
              itemA.pos.fromLevel +
              (itemA.pos.toLevel - itemA.pos.fromLevel) / 2;
            const itemBLevelCenter =
              itemB.pos.fromLevel +
              (itemB.pos.toLevel - itemB.pos.fromLevel) / 2;
            const itemARelativeLevel = itemALevelCenter / itemA.pos.totalLevels;
            const itemBRelativeLevel = itemBLevelCenter / itemB.pos.totalLevels;

            const itemADelta = Math.abs(
              itemARelativeLevel - focusedItemRelativeCenter
            );
            const itemBDelta = Math.abs(
              itemBRelativeLevel - focusedItemRelativeCenter
            );

            return itemADelta - itemBDelta;
          }
        }

        return result;
      })[0];

    if (nearestItem) {
      return {
        id: nearestItem.item.id,
        containerId,
      };
    } else {
      return null;
    }
  };

  getNextFocusedITemByDirection = (direction: NavigationDirections) => {
    switch (direction) {
      case NavigationDirections.RIGHT:
        return this.getNextFocusedItemHorizontal('right');
      case NavigationDirections.LEFT:
        return this.getNextFocusedItemHorizontal('left');
      case NavigationDirections.UP:
        return this.getNextFocusedItemVertical('top');
      case NavigationDirections.DOWN:
        return this.getNextFocusedItemVertical('bottom');
    }
  };

  moveFocus = (direction: NavigationDirections) => {
    if (this.focusedItem) {
      const nextFocusedItem = this.getNextFocusedITemByDirection(direction);

      if (nextFocusedItem) {
        this.setFocusedItem(nextFocusedItem.id, nextFocusedItem.containerId);
      } else if (direction === NavigationDirections.LEFT) {
        this.parent.callbacks.onFocusLeave?.(direction);
        this.resetFocus();
      }
    }
  };

  handleItemClick = (itemId: string, containerId: string) => {
    this.setFocusedItem(itemId, containerId);
  };
}
