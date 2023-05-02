import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../../../helpers/StoreProvider';
import {
  ResizableBlocksDropItemData,
  ResizableBlocksItemData,
  ResizableBlocksItemPosData,
  ResizableBlocksTypes,
} from '../types';
import { v4 as uuidv4 } from 'uuid';
import { FC, MouseEvent as ReactMouseEvent } from 'react';
import { ResizableBlocksNavigation } from './navigation';
import { NavigationDirections } from '../../../../../../../types/navigation';

export type ResizableBlocksComponent = FC<{ id: string; data?: any }>;

export type ResizableBlocksProps = {
  block?: FC<{ id: string }>;
  pixelValue?: number;
  minValue?: number;
  maxValue?: number;
  grid?: number;
  isHotkeysEnabled?: boolean;
  callbacks?: {
    onItemCreate?: (item: ResizableBlocksItemData) => void;
    onFocusLeave?: (direction: NavigationDirections) => void;
    onFocusItem?: (itemId: string) => void;
    onItemRemove?: (itemId: string) => void;
  };
};

export class ResizableBlocksStore {
  constructor() {
    makeAutoObservable(this);
  }

  navigation = new ResizableBlocksNavigation(this);

  callbacks: ResizableBlocksProps['callbacks'] = {};
  component: ResizableBlocksComponent | null = null;
  pixelValue?: number = undefined;
  minValue?: number = 0;
  maxValue?: number = 24 * 60;
  grid: number = 10;

  wrapperRef: HTMLElement = null;
  wrapperBounds: DOMRect = null;
  containers: Record<string, { from: number; to: number; ref: HTMLElement }> =
    {};
  containersBounds: { bound: { x: number; width: number }; id: string }[] = [];

  temp: ResizableBlocksItemData | null = null;
  items: Record<string, ResizableBlocksItemData> = {};
  dropItem: ResizableBlocksDropItemData | null = null;
  isHotkeysEnabled: boolean = false;

  cursor: string = 'default';
  resizeActiveHandler: 'top' | 'bottom' | null = null;

  isDraggingActive: boolean = false;
  isResizingActive: boolean = false;
  isCreatingActive: boolean = false;
  isDroppingActive: boolean = false;

  isPreparedForDropping: boolean = false;

  isPreparedForDragging: boolean = false;
  draggingStartData: string | null = null;

  isPreparedForResizing: boolean = false;
  resizingStartData: { itemId: string; side: 'top' | 'bottom' } | null = null;

  isPreparedForCreating: boolean = false;

  mouseDownPos: { x: number; y: number } = null;
  resolvedMouseDownPos: {
    containerId: string;
    value: number;
  } | null = null;
  mouse: {
    x: number;
    y: number;
  } = {
    x: 0,
    y: 0,
  };

  itemsPositions: Record<string, Record<string, ResizableBlocksItemPosData>> =
    {};

  get itemsPositionsList() {
    return Object.values(this.itemsPositions);
  }

  get tempPosition() {
    if (this.temp) {
      return this.makePosition(this.temp, true);
    }

    return null;
  }

  get itemsList(): ResizableBlocksItemData[] {
    return Object.values(this.items);
  }

  get itemsByContainerId(): Record<string, ResizableBlocksItemData[]> {
    return this.itemsPositionsList.reduce(
      (acc: Record<string, ResizableBlocksItemData[]>, itemPos) => {
        Object.keys(itemPos).forEach((containerId) => {
          const item = this.items[itemPos[containerId].id];

          if (!acc[containerId]) {
            acc[containerId] = [];
          }

          acc[containerId].push(item);
        });

        return acc;
      },
      {}
    );
  }

  get resolvedMouse() {
    return this.resolveMouse(this.mouse);
  }

  get isMouseInBounds() {
    if (this.wrapperBounds) {
      return (
        this.mouse.x >= this.wrapperBounds.left &&
        this.mouse.x <= this.wrapperBounds.right &&
        this.mouse.y >= this.wrapperBounds.top &&
        this.mouse.y <= this.wrapperBounds.bottom
      );
    } else {
      return false;
    }
  }

  get movingDirection() {
    if (this.resolvedMouse.value > this.resolvedMouseDownPos.value) {
      return 'bottom';
    } else if (this.resolvedMouse.value < this.resolvedMouseDownPos.value) {
      return 'top';
    }

    return null;
  }

  get ratio() {
    if (this.pixelValue) {
      return this.pixelValue;
    } else {
      const delta = this.maxValue - this.minValue;
      const gridBounds = this.wrapperRef.scrollHeight / delta;

      return this.pixelValue ? this.pixelValue : gridBounds;
    }
  }

  get isChangesActive() {
    return (
      this.isDraggingActive ||
      this.isResizingActive ||
      this.isCreatingActive ||
      this.isDroppingActive
    );
  }

  getItemContainerId(itemId: string) {
    const item = this.items[itemId];

    return Object.entries(this.containers)
      .filter(([id, { from, to }]) => {
        return item.start >= from && item.end <= to;
      })
      .sort(([idA, { from: fromA }], [idB, { from: fromB }]) => {
        return fromA - fromB;
      })
      .map(([id]) => id)[0];
  }

  makePosition = (
    item: ResizableBlocksItemData,
    isTemp: boolean = false
  ): Record<string, ResizableBlocksItemPosData> => {
    return Object.entries(this.containers)
      .filter(([, { from, to }]) => {
        return (
          (item.start >= from && item.start <= to) ||
          (item.end >= from && item.end <= to) ||
          (item.start <= from && item.end >= to)
        );
      })
      .reduce((acc, [containerId]) => {
        const itemPos = {
          id: item.id,
          type: item.type,
          isTemp,
          containerId: containerId,
          y: this.castStartToPixel(item.start, containerId),
          height: this.castDurationToHeight(item.start, item.end, containerId),
          color: 'blue',
          fromLevel: 0,
          toLevel: 0,
          totalLevels: 0,
          data: item.data,
        };

        if (itemPos.height > 0) {
          acc[containerId] = itemPos;
        }

        return acc;
      }, {});
  };

  setTemp = (itemId?: string) => {
    const item = this.items[itemId];

    if (item) {
      this.temp = { ...item };
    } else {
      this.temp = {
        id: 'temp',
        start: 0,
        end: 0,
        color: 'blue',
        type: ResizableBlocksTypes.SOLID,
      };
    }
  };

  updateItemPosition = (item: ResizableBlocksItemData) => {
    this.itemsPositions[item.id] = this.makePosition(item);
  };

  mergeTemp = () => {
    const item = this.items[this.temp.id];

    item.start = this.temp.start;
    item.end = this.temp.end;

    this.temp = null;

    this.updateItemPosition(item);
  };

  prepareForAction = () => {
    this.containersBounds = this.getContainersBounds();
    this.wrapperBounds = this.wrapperRef.getBoundingClientRect();

    this.mouseDownPos = {
      x: this.mouse.x,
      y: this.mouse.y,
    };
    this.resolvedMouseDownPos = this.resolveMouse(this.mouseDownPos);
  };

  setMouseCursor = (cursor: string) => {
    this.cursor = cursor;
  };

  resetMouseCursor = () => {
    this.cursor = 'default';
  };

  getContainersBounds() {
    const bounds = Object.entries(this.containers).map(([id, { ref }]) => {
      const bound = ref.getBoundingClientRect();

      return {
        bound: {
          x: Math.round(bound.x),
          width: Math.round(bound.width),
        },
        id,
      };
    });

    return bounds.sort(({ bound: a }, { bound: b }) => a.x - b.x);
  }

  setContainersRefs = (
    ref: HTMLElement,
    id: string,
    from: number,
    to: number
  ) => {
    if (ref) {
      if (!this.containers[id]) {
        this.containers[id] = { ref, from, to };
      } else {
        this.containers[id].ref = ref;
        this.containers[id].from = from;
        this.containers[id].to = to;
      }
    } else {
      delete this.containers[id];
    }
  };

  setWrapperRef = (ref: HTMLElement) => {
    this.wrapperRef = ref;
  };

  castStartToPixel = (start: number, containerId: string) => {
    const { from } = this.containers[containerId];

    return (Math.max(start, from) - from) * this.ratio;
  };

  castDurationToHeight(start: number, end: number, containerId: string) {
    const { from, to } = this.containers[containerId];

    return (Math.min(end, to) - Math.max(start, from)) * this.ratio;
  }

  resolveMouse = (mouse: { x: number; y: number }) => {
    const containerId = this.castXToContainerId(mouse.x);

    return {
      containerId,
      value: this.castYToGrid(mouse.y, containerId),
    };
  };

  castYToGrid(y: number, containerId: string) {
    const resolvedY = y - this.wrapperBounds.top + this.wrapperRef.scrollTop;

    return containerId
      ? Math.round(resolvedY / this.ratio / this.grid) * this.grid +
          this.containers[containerId].from
      : 0;
  }

  castXToContainerId(x: number) {
    const leftCorner = this.containersBounds[0].bound.x;
    const { bound: rightContainerBound } =
      this.containersBounds[this.containersBounds.length - 1];
    const rightCorner = rightContainerBound.x + rightContainerBound.width;

    if (x < leftCorner) {
      return this.containersBounds[0].id;
    } else if (x > rightCorner) {
      return this.containersBounds[this.containersBounds.length - 1].id;
    } else {
      const item = this.containersBounds.find(({ bound }) => {
        return x >= bound.x && x <= bound.x + bound.width + 1;
      });

      if (item) {
        return item.id;
      }

      return null;
    }
  }

  createItem = (item: {
    start: number;
    end: number;
    type?: ResizableBlocksTypes;
    color?: string;
    data?: any;
  }) => {
    const newItem: ResizableBlocksItemData = {
      id: uuidv4(),
      end: item.end,
      start: item.start,
      color: item.color || 'blue',
      type: item.type || ResizableBlocksTypes.SOLID,
      data: item.data,
    };

    this.addItem(newItem);

    this.callbacks.onItemCreate?.(newItem);
  };

  addItem = (item: ResizableBlocksItemData) => {
    this.items[item.id] = item;
    this.itemsPositions[item.id] = this.makePosition(item);
  };

  removeItem = (id: string) => {
    delete this.items[id];
    delete this.itemsPositions[id];

    this.callbacks.onItemRemove?.(id);
  };

  prepareForCreating = () => {
    this.prepareForAction();
    this.isPreparedForCreating = true;
  };

  startCreating = () => {
    this.isCreatingActive = true;
    this.setTemp();

    this.temp.start = this.resolvedMouse.value;
    this.temp.end = this.temp.start + this.grid;
  };

  continueCreating = () => {
    if (this.movingDirection === 'bottom') {
      this.temp.start = this.resolvedMouseDownPos.value;
      this.temp.end = this.resolvedMouse.value;
    } else if (this.movingDirection === 'top') {
      this.temp.start = this.resolvedMouse.value;
      this.temp.end = this.resolvedMouseDownPos.value;
    }

    this.boundItem(this.temp);
  };

  endCreating = () => {
    this.createItem({
      start: this.temp.start,
      end: this.temp.end,
    });

    this.temp = null;
    this.isCreatingActive = false;
  };

  prepareForDropping = (dropItem: ResizableBlocksDropItemData) => {
    if (dropItem && !this.dropItem) {
      this.dropItem = dropItem;
      this.prepareForAction();
      this.isPreparedForDropping = true;
    }

    if (!dropItem && this.dropItem) {
      this.dropItem = null;
      this.isPreparedForDropping = false;
    }
  };

  startDropping = () => {
    this.isDroppingActive = true;
    this.setTemp();
    this.temp.color = this.dropItem.color;
    this.temp.type = this.dropItem.type;
    this.temp.data = this.dropItem.data;
  };

  stopDropping = () => {
    this.isDroppingActive = false;
    this.temp = null;
  };

  continueDropping = () => {
    this.temp.start = this.resolvedMouse.value;
    this.temp.end = this.temp.start + this.grid;
  };

  endDropping = () => {
    this.createItem({
      start: this.temp.start,
      end: this.temp.end,
      color: this.temp.color,
      type: this.temp.type,
      data: this.temp.data,
    });

    this.temp = null;
    this.dropItem = null;
    this.isDroppingActive = false;
    this.isPreparedForDropping = false;
  };

  prepareForResizing = (itemId: string, side: 'top' | 'bottom') => {
    this.prepareForAction();
    this.isPreparedForResizing = true;
    this.resizingStartData = {
      itemId,
      side,
    };
  };

  startResizing = (itemId: string, direction: 'top' | 'bottom') => {
    this.isResizingActive = true;
    this.resizeActiveHandler = direction;
    this.setTemp(itemId);
    this.setMouseCursor('ns-resize');
    this.resetPreparations();
  };

  continueResizing = () => {
    const mouse = this.resolvedMouse;
    const item = this.items[this.temp.id];
    const delta = mouse.value - this.resolvedMouseDownPos.value;

    if (this.resizeActiveHandler === 'bottom') {
      const resizeSide = mouse.value > item.start ? 'bottom' : 'top';

      if (resizeSide === 'top') {
        this.temp.start = Math.min(mouse.value, item.start - this.grid);
        this.temp.end = item.start;
      } else if (resizeSide === 'bottom') {
        this.temp.start = item.start;
        this.temp.end = item.end + delta;
      }
    } else if (this.resizeActiveHandler === 'top') {
      const resizeSide = mouse.value > item.end ? 'bottom' : 'top';

      if (resizeSide === 'bottom') {
        this.temp.start = item.end;
        this.temp.end = item.start + delta;
      } else if (resizeSide === 'top') {
        this.temp.start = Math.min(item.start + delta, item.end - this.grid);
        this.temp.end = item.end;
      }
    }

    this.boundItem(this.temp);
  };

  endResizing = () => {
    this.isResizingActive = false;
    this.mergeTemp();
    this.resetMouseCursor();
  };

  prepareForDragging = (itemId: string) => {
    this.prepareForAction();
    this.isPreparedForDragging = true;
    this.draggingStartData = itemId;
  };

  startDragging = (itemId: string) => {
    this.isDraggingActive = true;
    this.setTemp(itemId);
    this.setMouseCursor('move');
    this.resetPreparations();
  };

  continueDragging = () => {
    const mouse = this.resolvedMouse;
    const item = this.items[this.temp.id];
    const delta = mouse.value - this.resolvedMouseDownPos.value;

    this.temp.start = item.start + delta;
    this.temp.end = item.end + delta;

    this.boundItem(this.temp);
  };

  endDragging = () => {
    this.isDraggingActive = false;
    this.mergeTemp();
    this.resetMouseCursor();
  };

  resetPreparations = () => {
    this.isPreparedForDragging = false;
    this.isPreparedForResizing = false;
    this.isPreparedForCreating = false;
    this.draggingStartData = null;
    this.resizingStartData = null;
  };

  checkMouseInBounds = () => {
    const { x, y } = this.mouse;
    const { left, top, width, height } = this.wrapperBounds;

    return x >= left && x <= left + width && y >= top && y <= top + height;
  };

  boundItem = (item: ResizableBlocksItemData) => {
    const { start, end } = item;

    const newEnd = Math.min(end, this.maxValue);
    const newStart = Math.max(start, this.minValue);
    const deltaStart = item.start - newStart;
    const deltaEnd = item.end - newEnd;

    // item.start = newStart - deltaEnd;
    // item.end = newEnd - deltaStart;
  };

  normalizeEvents = (containerIds?: string[]) => {
    const levels = this.buildLevels(containerIds);
    this.resolveIntersections(levels);
  };

  buildLevels = (containerIds?: string[]) => {
    const levels: Record<string, string[][]> = {};

    Object.keys(this.itemsByContainerId).forEach((containerId) => {
      if (!containerIds || containerIds.includes(containerId)) {
        const slice = this.itemsByContainerId[containerId].sort(
          ({ start: a }, { start: b }) => a - b
        );
        let currentLevel: string[] = [];

        while (slice.length) {
          for (let i = 0; i < slice.length; i++) {
            const item = slice[i];
            const lastItem = this.items[currentLevel[currentLevel.length - 1]];

            if (
              currentLevel.length === 0 ||
              !lastItem ||
              item.start >= lastItem.end
            ) {
              currentLevel.push(item.id);
              slice.splice(i, 1);
              i--;
            }

            const itemPos = this.itemsPositions[item.id][containerId];

            if (itemPos) {
              itemPos.totalLevels = 0;
              itemPos.toLevel = 0;
              itemPos.fromLevel = 0;
            }
          }

          if (!levels[containerId]) {
            levels[containerId] = [];
          }

          levels[containerId].push(currentLevel);
          currentLevel = [];
        }
      }
    });

    return levels;
  };

  resolveIntersections = (levels: Record<string, string[][]>) => {
    Object.entries(levels).forEach(([containerId, containerLevels]) => {
      for (let i = 0; i < containerLevels.length; i++) {
        const currentLevel = containerLevels[i];
        const currentItems = currentLevel.map((id) => this.items[id]);

        currentItems.forEach((item) => {
          const allIntersectedItems = [item];
          let prevLevelIntersections = [item];
          let startLevelIntersections = -1;
          let endLevelIntersections = -1;
          let hasIntersections = false;

          for (let j = i + 1; j < containerLevels.length; j++) {
            const nextLevel = containerLevels[j];

            if (nextLevel) {
              const nextLevelItems = nextLevel.map((id) => this.items[id]);

              if (nextLevelItems) {
                const intersections = nextLevelItems.filter((nextItem) =>
                  prevLevelIntersections.some(
                    (prevItem) =>
                      (prevItem.end > nextItem.start &&
                        prevItem.start <= nextItem.start) ||
                      (prevItem.start < nextItem.end &&
                        prevItem.start >= nextItem.start)
                  )
                );

                if (intersections.length) {
                  prevLevelIntersections = intersections;
                  allIntersectedItems.push(...intersections);
                  hasIntersections = true;
                }
              }
            }

            if (
              prevLevelIntersections.length &&
              prevLevelIntersections[0] !== item
            ) {
              if (startLevelIntersections === -1) {
                startLevelIntersections = j;
              }

              if (hasIntersections) {
                endLevelIntersections = j + 1;
                hasIntersections = false;
              }
            }
          }

          const itemPos = this.itemsPositions[item.id][containerId];

          if (itemPos) {
            itemPos.fromLevel = i;
            itemPos.toLevel = Math.max(
              startLevelIntersections === -1 ? i + 1 : startLevelIntersections,
              allIntersectedItems.length > 1 ? 0 : itemPos.totalLevels
            );
            allIntersectedItems.forEach((intersectedItem) => {
              const intersectedItemPos =
                this.itemsPositions[intersectedItem.id][containerId];

              if (!intersectedItemPos.totalLevels) {
                intersectedItemPos.totalLevels =
                  endLevelIntersections === -1 ? i + 1 : endLevelIntersections;
              }
            });
          }
        });
      }
    });
  };

  commitChanges = () => {
    if (this.isChangesActive) {
      if (this.isCreatingActive) {
        this.endCreating();
      }

      if (this.isResizingActive) {
        this.endResizing();
      }

      if (this.isDraggingActive) {
        this.endDragging();
      }

      if (this.isDroppingActive) {
        this.endDropping();
      }

      this.normalizeEvents(); // ToDo put containers ids
    }
  };

  handleMouseUp = (e: MouseEvent) => {
    this.commitChanges();
    this.resetPreparations();
  };

  handleMouseDown = (e: ReactMouseEvent) => {
    this.navigation.resetFocus();
    this.prepareForAction();

    const isInBounds = this.checkMouseInBounds();

    if (isInBounds) {
      this.prepareForCreating();
    }
  };

  handleMouseMove = (e: MouseEvent) => {
    if (this.isPreparedForDragging) {
      this.startDragging(this.draggingStartData);
    }

    if (this.isPreparedForResizing) {
      this.startResizing(
        this.resizingStartData.itemId,
        this.resizingStartData.side
      );
    }

    if (this.isPreparedForCreating) {
      this.startCreating();
    }

    if (this.isPreparedForDropping) {
      if (this.isMouseInBounds) {
        if (!this.isDroppingActive) {
          this.startDropping();
        }
      } else {
        if (this.isDroppingActive) {
          this.stopDropping();
        }
      }
    }

    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;

    if (this.isCreatingActive) {
      this.continueCreating();
    }

    if (this.isResizingActive) {
      this.continueResizing();
    }

    if (this.isDraggingActive) {
      this.continueDragging();
    }

    if (this.isDroppingActive) {
      this.continueDropping();
    }
  };

  handleHandlerMouseDown = (itemId: string, side: 'top' | 'bottom') => {
    this.prepareForResizing(itemId, side);
  };

  handleItemMouseDown = (itemId: string) => {
    this.prepareForDragging(itemId);
  };

  recalculateItemsPositions = () => {
    this.itemsList.forEach((item) => {
      this.itemsPositions[item.id] = this.makePosition(item);
    });

    this.normalizeEvents();
  };

  init = () => {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  destroy = () => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  };

  setItems = (items: Record<string, ResizableBlocksItemData>) => {
    this.items = items;
    this.recalculateItemsPositions();
  };

  setDropItem = (dropItem: ResizableBlocksDropItemData | null) => {
    this.prepareForDropping(dropItem);
  };

  update = (props: ResizableBlocksProps) => {
    this.grid = props.grid;
    this.minValue = props.minValue;
    this.maxValue = props.maxValue;
    this.pixelValue = props.pixelValue;
    this.component = props.block;
    this.callbacks = props.callbacks || {};

    this.isHotkeysEnabled = props.isHotkeysEnabled;
  };
}

export const {
  StoreProvider: ResizableBlocksStoreProvider,
  useStore: useResizableBlocksStore,
} = getProvider(ResizableBlocksStore);
