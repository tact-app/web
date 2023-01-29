import { makeAutoObservable, reaction } from 'mobx';
import { PropsWithChildren } from 'react';
import { getProvider } from '../../../helpers/StoreProvider';
import { subscriptions } from '../../../helpers/subscriptions';
import { MouseEvent } from 'react';

export type ResizableGroupProps = PropsWithChildren;

export type ResizableGroupConfig = {
  size: number;
  width?: number;
  minWidth?: number;
  onlyShrink?: boolean;
  minFixedWidth?: number;
  flexible?: boolean;
  onMinWidth?: () => void;
  expanded?: boolean; // not supported yet
};

export class ResizableGroupStore {
  constructor() {
    makeAutoObservable(this);
  }

  animationFrame: number = null;
  resizingIndex: number | null = null;
  widthsUpdate: number[] = [];
  widths: number[] = [];
  containerWidth = 0;
  resizeStart: {
    widths: number[];
    x: number;
  } | null = null;
  configs: ResizableGroupConfig[] = [];
  disabledChildren: boolean[] = [];

  skipWidthsRecalc: boolean = false;
  isFirstRender: boolean = true;
  isAnimationActive: boolean = false;
  enterAnimation = {};

  get width() {
    if (this.containerWidth) {
      return this.containerWidth - this.totalFixedWidths;
    } else {
      return 0;
    }
  }

  get hasContainerWidth() {
    return Boolean(this.containerWidth);
  }

  get activeChildren() {
    return this.configs.map((config, index) => {
      return !this.disabledChildren[index] ? this.configs[index].size || 0 : 0;
    });
  }

  get totalSize() {
    return this.activeChildren.reduce((acc, size) => acc + size, 0);
  }

  get totalFixedWidths() {
    return this.configs.reduce((acc, config) => acc + (config.width || 0), 0);
  }

  get expandedChildren() {
    return this.configs.map((config) => config.expanded || false);
  }

  get fixedChildren() {
    return this.configs.map((config) => {
      if (config) {
        return config.width !== undefined;
      } else {
        return false;
      }
    });
  }

  setChildConfig = (index, config: ResizableGroupConfig) => {
    this.configs[index] = config;
  };

  setChildActive = (index, active: boolean) => {
    this.disabledChildren[index] = !active;
  };

  getWidth = (index: number) => {
    const childWidth = this.widths[index];

    return childWidth + 'px';
  };

  isFixed = (index: number) => {
    return this.fixedChildren[index];
  };

  hasResizableHandler = (index: number) => {
    if (this.isFixed(index) && index === this.configs.length - 1) {
      return false;
    }

    if (this.configs[index]) {
      for (let i = index; i--;) {
        if (this.isFixed(i)) {
          return false;
        }

        if (this.configs[i].size) {
          return true;
        }
      }
    }

    return false;
  };

  setContainerWidth = (width: number) => {
    this.containerWidth = width;
  };

  updateWidths = (widths: number[]) => {
    this.widthsUpdate = widths;

    cancelAnimationFrame(this.animationFrame);

    this.animationFrame = requestAnimationFrame(this.commitWidths);
  };

  commitWidths = () => {
    this.widths = this.widthsUpdate;
  };

  checkMinWidth = (width, index) => {
    const { onMinWidth, minWidth } = this.configs[index]
    if (onMinWidth && minWidth && width <= minWidth) {
      onMinWidth()
      this.handleResizeEnd()
    }
  }

  handleResize = (e) => {
    if (this.resizingIndex === null || !this.resizeStart) {
      return;
    }

    let offset = e.clientX - this.resizeStart.x;
    const decrementSide = offset < 0 ? 'left' : 'right';

    const shouldGrow = (index, side) =>
      this.resizingIndex - 1 !== index
        ? !this.configs[index].onlyShrink || decrementSide === side
        : true;

    let leftSideTotal = 0;
    let rightSideTotal = 0;

    this.activeChildren.forEach((size, index) => {
      if (this.activeChildren[index]) {
        if (index < this.resizingIndex && shouldGrow(index, 'left')) {
          leftSideTotal += this.resizeStart.widths[index];
        } else if (index >= this.resizingIndex && shouldGrow(index, 'right')) {
          rightSideTotal += this.resizeStart.widths[index];
        }
      }
    });

    const getDelta = (index: number, side: 'left' | 'right') => {
      const proportion =
        this.resizeStart.widths[index] /
        (side === 'left' ? leftSideTotal : rightSideTotal);

      return offset * proportion;
    };

    const newWidths = this.activeChildren.map((size, index) => {
      const startWidth = this.resizeStart?.widths[index]

      if (!startWidth) return;

      if (size) {
        if (
          index < this.resizingIndex &&
          leftSideTotal &&
          shouldGrow(index, 'left')
        ) {
          const leftScalingWidth = startWidth + getDelta(index, 'left');
          this.checkMinWidth(leftScalingWidth, index)
          return leftScalingWidth;
        } else if (
          index >= this.resizingIndex &&
          rightSideTotal &&
          shouldGrow(index, 'right')
        ) {
          const rightScalingWidth = startWidth - getDelta(index, 'right');
          this.checkMinWidth(rightScalingWidth, index)
          return rightScalingWidth;
        }
      }

      return startWidth;
    });

    this.updateWidths(newWidths);
  };

  handleResizeStart = (index: number) => (e: MouseEvent) => {
    this.resizeStart = {
      widths: [...this.widths],
      x: e.clientX,
    };

    this.resizingIndex = index;

    document.body.style.userSelect = 'none';

    document.addEventListener('mousemove', this.handleResize);
    document.addEventListener('mouseup', this.handleResizeEnd);
  };

  handleResizeEnd = () => {
    this.resizingIndex = null;
    this.resizeStart = null;

    document.body.style.userSelect = '';

    document.removeEventListener('mousemove', this.handleResize);
    document.removeEventListener('mouseup', this.handleResizeEnd);
  };

  handleAnimationEnd = (e) => {
    if (e.target.getAttribute('name') === 'resizable-child') {
      this.isAnimationActive = false;
      this.enterAnimation = {};
    }
  };

  handleFixedAnimationStart = (e) => {
    if (e.target.getAttribute('name') === 'resizable-child') {
      this.isAnimationActive = true;
    }
  };

  subscribe = () =>
    subscriptions(
      reaction(
        () => this.width,
        (width, prevWidth) => {
          if (width && prevWidth && !this.skipWidthsRecalc) {
            const diff = prevWidth / width;

            this.updateWidths(
              this.widths.map((width, index) => {
                if (this.isFixed(index)) {
                  return this.configs[index].width;
                } else {
                  return width / diff;
                }
              })
            );
          }
        }
      ),
      reaction(
        () => ({
          children: this.activeChildren,
          hasWidth: this.hasContainerWidth,
        }),
        (current, prev) => {
          const { children } = current;

          if (!this.isFirstRender && prev?.hasWidth) {
            this.isAnimationActive = true;
            this.skipWidthsRecalc = true;

            setTimeout(() => {
              this.skipWidthsRecalc = false;
            });

            children.forEach((size, index) => {
              if (size && !prev.children[index]) {
                this.enterAnimation[index] = true;
              }
            });
          }

          this.isFirstRender = false;

          this.updateWidths(
            children.map((childSize, index) => {
              if (this.isFixed(index)) {
                return this.configs[index].width;
              } else {
                return (this.width / this.totalSize) * childSize;
              }
            })
          );
        },
        { fireImmediately: true }
      ),
      reaction(
        () => this.totalFixedWidths,
        () => {
          this.isAnimationActive = true;
        }
      )
    );

  update = () => { };
}

export const {
  StoreProvider: ResizableGroupStoreProvider,
  useStore: useResizableGroupStore,
} = getProvider(ResizableGroupStore);
