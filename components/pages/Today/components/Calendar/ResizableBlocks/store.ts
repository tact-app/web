import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../../helpers/StoreProvider';
import { ResizableBlocksItemData, ResizableBlocksItemPosData } from './types';
import { v4 as uuidv4 } from 'uuid';
import { MouseEvent as ReactMouseEvent } from 'react';

export type ResizableBlocksProps = {
  items: ResizableBlocksItemData[];
  pixelValue?: number;
  minValue?: number;
  maxValue?: number;
  callbacks?: {};
};

type NeighbourTree = Record<string, string[]>;

export class ResizableBlocksStore {
  constructor() {
    makeAutoObservable(this);
  }

  pixelValue?: number = undefined;
  minValue?: number = 0;
  maxValue?: number = 24 * 60;

  cursor: string = 'default';
  grid: number = 10;
  wrapperRef: HTMLElement = null;
  wrapperBounds: DOMRect = null;
  containersRefs: Record<string, HTMLElement> = {};
  containersBounds: { bound: DOMRect; id: string }[] = [];

  temp: ResizableBlocksItemData | null = null;

  items: ResizableBlocksItemData[] = [];

  resizeActiveHandler: 'top' | 'bottom' | null = null;
  isDraggingActive: boolean = false;
  isResizingActive: boolean = false;
  isCreatingActive: boolean = false;

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

  get tempPositioning() {
    if (this.temp) {
      return {
        id: this.temp.id,
        containerId: this.temp.containerId,
        y: this.castStartToPixel(this.temp.start),
        height: this.temp.duration * this.ratio,
        isTemp: true,
        fromLevel: 0,
        toLevel: 0,
        totalLevels: 0,
      };
    }

    return null;
  }

  get itemsPositioning(): ResizableBlocksItemPosData[] {
    return this.items.map((item) => {
      return {
        id: item.id,
        containerId: item.containerId,
        y: this.castStartToPixel(item.start),
        height: item.duration * this.ratio,
        fromLevel: item.fromLevel,
        toLevel: item.toLevel,
        totalLevels: item.totalLevels,
      };
    });
  }

  get itemsMap(): Record<string, ResizableBlocksItemData> {
    return this.items.reduce((acc, item) => {
      acc[item.id] = item;

      return acc;
    }, {});
  }

  get resolvedMouse() {
    return {
      containerId: this.castXToContainerId(this.mouse.x),
      value: this.castYToGrid(this.mouse.y),
    };
  }

  get movingDirection() {
    if (this.mouse.y > this.mouseDownPos.y) {
      return 'bottom';
    } else if (this.mouse.y < this.mouseDownPos.y) {
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
      this.isDraggingActive || this.isResizingActive || this.isCreatingActive
    );
  }

  prepareForAction = () => {
    this.containersBounds = this.getContainersBounds();
    this.wrapperBounds = this.wrapperRef.getBoundingClientRect();

    this.mouseDownPos = {
      x: this.mouse.x,
      y: this.mouse.y,
    };
    this.resolvedMouseDownPos = {
      containerId: this.castXToContainerId(this.mouseDownPos.x),
      value: this.castYToGrid(this.mouseDownPos.y),
    };
  };

  setMouseCursor = (cursor: string) => {
    this.cursor = cursor;
  };

  resetMouseCursor = () => {
    this.cursor = 'default';
  };

  getContainersBounds() {
    const bounds = Object.entries(this.containersRefs).map(([id, ref]) => ({
      bound: ref.getBoundingClientRect(),
      id,
    }));

    return bounds.sort(({ bound: a }, { bound: b }) => a.x - b.x);
  }

  setContainersRefs = (ref: HTMLElement, id: string) => {
    if (ref) {
      this.containersRefs[id] = ref;
    } else {
      delete this.containersRefs[id];
    }
  };

  setWrapperRef = (ref: HTMLElement) => {
    this.wrapperRef = ref;
  };

  castStartToPixel(start: number) {
    return start * this.ratio;
  }

  castYToGrid(y: number) {
    const resolvedY = y - this.wrapperBounds.top + this.wrapperRef.scrollTop;

    return Math.round(resolvedY / this.ratio / this.grid) * this.grid;
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
        return x >= bound.x && x <= bound.x + bound.width;
      });

      if (item) {
        return item.id;
      }

      return null;
    }
  }

  startChanges = (itemId?: string) => {
    if (itemId) {
      this.temp = {
        ...this.itemsMap[itemId],
      };
    } else {
      this.temp = {
        id: 'temp',
        containerId: null,
        start: 0,
        duration: 0,
        fromLevel: 0,
        toLevel: 0,
        totalLevels: 0,
      };
    }
  };

  createItem = (item: {
    duration: number;
    start: number;
    containerId: string;
  }) => {
    this.addItem({
      id: uuidv4(),
      duration: item.duration,
      start: item.start,
      containerId: item.containerId,
      fromLevel: 0,
      toLevel: 0,
      totalLevels: 0,
    });
  };

  addItem = (item: ResizableBlocksItemData) => {
    this.items.push(item);
  };

  removeItem = (id: string) => {
    this.items = this.items.filter((item) => item.id !== id);
  };

  startCreating = () => {
    this.isCreatingActive = true;
    this.startChanges();

    this.temp.start = this.resolvedMouse.value;
    this.temp.duration = this.grid;
    this.temp.containerId = this.resolvedMouse.containerId;
  };

  continueCreating = () => {
    if (this.movingDirection === 'bottom') {
      this.temp.start = this.resolvedMouseDownPos.value;
      this.temp.duration = this.resolvedMouse.value - this.temp.start;
    } else if (this.movingDirection === 'top') {
      this.temp.start = this.resolvedMouse.value;
      this.temp.duration =
        this.resolvedMouseDownPos.value - this.resolvedMouse.value;
    }
  };

  endCreating = () => {
    this.createItem({
      start: this.temp.start,
      duration: this.temp.duration,
      containerId: this.temp.containerId,
    });

    this.temp = null;
    this.isCreatingActive = false;
  };

  startResizing = (itemId: string, direction: 'top' | 'bottom') => {
    this.isResizingActive = true;
    this.resizeActiveHandler = direction;
    this.startChanges(itemId);
    this.setMouseCursor('ns-resize');
  };

  continueResizing = () => {
    const mouse = this.resolvedMouse;
    const item = this.itemsMap[this.temp.id];
    const delta = mouse.value - this.resolvedMouseDownPos.value;

    if (this.resizeActiveHandler === 'bottom') {
      const resizeSide = mouse.value > item.start ? 'bottom' : 'top';

      if (resizeSide === 'top') {
        this.temp.start = mouse.value;
        this.temp.duration = item.start - mouse.value;
      } else if (resizeSide === 'bottom') {
        this.temp.start = item.start;
        this.temp.duration = item.duration + delta;
      }
    } else if (this.resizeActiveHandler === 'top') {
      const resizeSide =
        mouse.value > item.start + item.duration ? 'bottom' : 'top';

      if (resizeSide === 'bottom') {
        this.temp.start = item.start + item.duration;
        this.temp.duration = delta - item.duration;
      } else if (resizeSide === 'top') {
        this.temp.start = item.start + delta;
        this.temp.duration = item.duration - delta;
      }
    }
  };

  endResizing = () => {
    this.isResizingActive = false;
    this.itemsMap[this.temp.id].start = this.temp.start;
    this.itemsMap[this.temp.id].duration = this.temp.duration;
    this.resetMouseCursor();
  };

  startDragging = (itemId: string) => {
    this.isDraggingActive = true;
    this.startChanges(itemId);
    this.setMouseCursor('move');
  };

  continueDragging = () => {
    const mouse = this.resolvedMouse;
    const item = this.itemsMap[this.temp.id];
    const delta = mouse.value - this.resolvedMouseDownPos.value;

    this.temp.start = item.start + delta;
    this.temp.containerId = mouse.containerId;
  };

  endDragging = () => {
    this.isDraggingActive = false;
    this.itemsMap[this.temp.id].start = this.temp.start;
    this.itemsMap[this.temp.id].containerId = this.temp.containerId;
    this.resetMouseCursor();
  };

  checkMouseInBounds = () => {
    const { x, y } = this.mouse;
    const { left, top, width, height } = this.wrapperBounds;

    return x >= left && x <= left + width && y >= top && y <= top + height;
  };

  handleMouseMove = (e: MouseEvent) => {
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
  };

  handleHandlerMouseDown = (itemId: string, side: 'top' | 'bottom') => {
    this.prepareForAction();
    this.startResizing(itemId, side);
  };

  handleItemMouseDown = (itemId: string) => {
    this.prepareForAction();
    this.startDragging(itemId);
  };

  handleMouseDown = (e: ReactMouseEvent) => {
    this.prepareForAction();

    const isInBounds = this.checkMouseInBounds();

    if (isInBounds) {
      this.startCreating();
    }
  };

  buildLevels = (containerIds?: string[]) => {
    const itemsByContainer: Record<string, ResizableBlocksItemData[]> =
      this.items.reduce((acc, item) => {
        if (!acc[item.containerId]) {
          acc[item.containerId] = [];
        }

        acc[item.containerId].push(item);

        return acc;
      }, {});

    const levels = [];

    Object.keys(itemsByContainer).forEach((containerId) => {
      if (!containerIds || containerIds.includes(containerId)) {
        const slice = itemsByContainer[containerId].sort(
          ({ start: a }, { start: b }) => a - b
        );
        let currentLevel: string[] = [];

        while (slice.length) {
          for (let i = 0; i < slice.length; i++) {
            const item = slice[i];
            const lastItem =
              this.itemsMap[currentLevel[currentLevel.length - 1]];

            if (
              currentLevel.length === 0 ||
              !lastItem ||
              item.start >= lastItem.start + lastItem.duration
            ) {
              currentLevel.push(item.id);
              slice.splice(i, 1);
              i--;
            }

            item.totalLevels = 0;
          }

          levels.push(currentLevel);
          currentLevel = [];
        }
      }
    });

    for (let i = 0; i < levels.length; i++) {
      const currentLevel = levels[i];
      const currentItems = currentLevel.map((id) => this.itemsMap[id]);

      currentItems.forEach((item) => {
        const allIntersectedItems = [item];
        let prevLevelIntersections = [item];
        let startLevelIntersections = -1;
        let endLevelIntersections = -1;
        let hasIntersections = false;

        for (let j = i + 1; j < levels.length; j++) {
          const nextLevel = levels[j];

          if (nextLevel) {
            const nextLevelItems = nextLevel.map((id) => this.itemsMap[id]);

            if (nextLevelItems) {
              const intersections = nextLevelItems.filter((nextItem) =>
                prevLevelIntersections.some(
                  (prevItem) =>
                    (prevItem.start + prevItem.duration > nextItem.start &&
                      prevItem.start <= nextItem.start) ||
                    (prevItem.start < nextItem.start + nextItem.duration &&
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

        item.fromLevel = i;
        item.toLevel = Math.max(
          startLevelIntersections === -1 ? i + 1 : startLevelIntersections,
          allIntersectedItems.length > 1 ? 0 : item.totalLevels
        );
        allIntersectedItems.forEach((intersectedItem) => {
          if (!intersectedItem.totalLevels) {
            intersectedItem.totalLevels =
              endLevelIntersections === -1 ? i + 1 : endLevelIntersections;
          }
        });
      });
    }
  };

  commitChanges = () => {
    if (this.isChangesActive) {
      const containerIds = this.itemsMap[this.temp.id]
        ? [this.temp.containerId, this.itemsMap[this.temp.id].containerId]
        : [this.temp.containerId];

      if (this.isCreatingActive) {
        this.endCreating();
      }

      if (this.isResizingActive) {
        this.endResizing();
      }

      if (this.isDraggingActive) {
        this.endDragging();
      }

      this.buildLevels(containerIds);

      this.temp = null;
    }
  };

  handleMouseUp = (e: MouseEvent) => {
    this.commitChanges();
  };

  init = () => {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  destroy = () => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  };

  update = (props: ResizableBlocksProps) => null;
}

export const {
  StoreProvider: ResizableBlocksStoreProvider,
  useStore: useResizableBlocksStore,
} = getProvider(ResizableBlocksStore);
