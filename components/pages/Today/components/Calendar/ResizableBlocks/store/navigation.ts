import { ResizableBlocksStore } from './index';
import { makeAutoObservable } from 'mobx';
import { ResizableBlocksItemPosData } from '../types';
import { NavigationDirections } from '../../../../../../shared/TasksList/types';

export class ResizableBlocksNavigation {
  constructor(public parent: ResizableBlocksStore) {
    makeAutoObservable(this);
  }

  keyMap = {
    RIGHT: 'arrowright',
    LEFT: 'arrowleft',
    UP: 'arrowup',
    DOWN: 'arrowdown',
    TAB: 'tab',
    SHIFT_TAB: 'shift+tab',
    ENTER: 'enter',
    ESC: 'escape',
    DELETE: ['delete', 'backspace'],
  };

  hotkeyHandlers = {
    RIGHT: () => this.moveFocus(NavigationDirections.RIGHT),
    LEFT: () => this.moveFocus(NavigationDirections.LEFT),
    UP: () => this.moveFocus(NavigationDirections.UP),
    DOWN: () => this.moveFocus(NavigationDirections.DOWN),
    ENTER: console.log,
  };

  focusedItem: {
    id: string;
    containerId: string;
  } | null = null;

  setFocusedItem = (id: string, containerId: string) => {
    this.removeFocusedItem();

    Object.values(this.parent.itemsPositions[id]).forEach((item) => {
      item.isFocused = true;
    });

    this.focusedItem = {
      id,
      containerId,
    };
  };

  removeFocusedItem = () => {
    if (this.focusedItem) {
      Object.values(this.parent.itemsPositions[this.focusedItem.id]).forEach(
        (item) => {
          item.isFocused = false;
        }
      );
    }

    this.focusedItem = null;
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
    const focusedItemContainerItems =
      this.parent.itemsByContainerId[containerId];

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
        if (side === 'top') {
          return itemB.item.end - itemA.item.end;
        } else {
          return itemA.item.start - itemB.item.start;
        }
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
    const nextFocusedItem = this.getNextFocusedITemByDirection(direction);

    if (nextFocusedItem) {
      this.setFocusedItem(nextFocusedItem.id, nextFocusedItem.containerId);
    }
  };

  handleItemClick = (itemId: string, containerId: string) => {
    this.setFocusedItem(itemId, containerId);
  };
}
