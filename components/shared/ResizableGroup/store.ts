import { action, makeAutoObservable, reaction } from 'mobx';
import { HTMLChakraProps } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import { getProvider } from '../../../helpers/StoreProvider';
import { subscriptions } from '../../../helpers/subscriptions';
import { MouseEvent } from 'react';

export type ResizableGroupProps = PropsWithChildren<{
  configs: ResizableGroupConfig[];
}>;

export type ResizableGroupConfig = {
  size: number;
  width?: number;
  minWidth?: number;
  flexible?: boolean;
  props?: HTMLChakraProps<'div'>;
};

export class ResizableGroupStore {
  constructor() {
    makeAutoObservable(this);
  }

  resizingIndex: number | null = null;
  widths: number[] = [];
  containerWidth = 0;
  childrenCount = 0;
  resizeStart: {
    widths: number[];
    x: number;
  } | null = null;
  configs: ResizableGroupConfig[] = [];

  isFirstRender = true;
  isAnimationActive: boolean = false;

  get width() {
    if (this.containerWidth) {
      const fixedWidth = this.configs.reduce(
        (acc, { width: w }) => (w ? acc + w : acc),
        0
      );
      return this.containerWidth - fixedWidth;
    } else {
      return 0;
    }
  }

  get hasContainerWidth() {
    return Boolean(this.containerWidth);
  }

  get activeChildren() {
    return this.hasContainerWidth
      ? this.configs.map((config, index) => {
          if (index < this.childrenCount) {
            return this.configs[index].size || 0;
          }

          return 0;
        })
      : this.configs.map(() => 0);
  }

  get totalSize() {
    return this.activeChildren.reduce((acc, size) => acc + size, 0);
  }

  get totalFixedWidths() {
    return this.configs.reduce((acc, config) => acc + (config.width || 0), 0);
  }

  getWidth = (index: number) => {
    const childWidth = this.widths[index];
    const isFixed = this.isFixed(index);

    if (isFixed) {
      return this.configs[index].width;
    } else if (this.activeChildren[index]) {
      return childWidth + 'px';
    } else {
      return 0;
    }
  };

  isFixed = (index: number) => {
    if (this.configs[index]) {
      return this.configs[index].width !== undefined;
    } else {
      return false;
    }
  };

  hasResizableHandler = (index: number) => {
    if (this.configs[index]) {
      for (let i = index; i--; ) {
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

  setChildrenCount = (count: number) => {
    this.childrenCount = count;
  };

  updateWidths = (widths: number[]) => {
    requestAnimationFrame(
      action(() => {
        this.widths = widths;
      })
    );
  };

  handleResize = (e) => {
    if (this.resizingIndex === null || !this.resizeStart) {
      return;
    }

    let offset = e.clientX - this.resizeStart.x;

    const newWidths = [...this.widths];

    const prevActiveItemsCount = this.activeChildren
      .slice(0, this.resizingIndex)
      .filter(Boolean).length;
    const nextActiveItemsCount = this.activeChildren
      .slice(this.resizingIndex)
      .filter(Boolean).length;

    const increment = prevActiveItemsCount ? offset / prevActiveItemsCount : 0;
    const decrement = nextActiveItemsCount ? offset / nextActiveItemsCount : 0;

    for (let i = 0; i < this.resizingIndex; i++) {
      if (this.activeChildren[i]) {
        newWidths[i] = this.resizeStart.widths[i] + increment;
      }
    }

    for (let i = this.resizingIndex; i < newWidths.length; i++) {
      if (this.activeChildren[i]) {
        newWidths[i] = this.resizeStart.widths[i] - decrement;
      }
    }

    this.updateWidths(newWidths);
  };

  handleResizeStart = (index: number) => (e: MouseEvent) => {
    this.resizeStart = {
      widths: [...this.widths],
      x: e.clientX,
    };

    this.resizingIndex = index;

    document.body.style.userSelect = 'none';
  };

  handleResizeEnd = () => {
    this.resizingIndex = null;
    this.resizeStart = null;
    document.body.style.userSelect = '';
  };

  handleAnimationEnd = (e) => {
    if (e.target.getAttribute('name') === 'resizable-child') {
      this.isAnimationActive = false;
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
          if (width && prevWidth) {
            const diff = prevWidth / width;
            this.updateWidths(this.widths.map((width) => width / diff));
          }
        }
      ),
      reaction(
        () => this.activeChildren,
        (children) => {
          if (!this.isFirstRender) {
            this.isAnimationActive = true;
          }

          this.isFirstRender = false;

          setTimeout(() =>
            this.updateWidths(
              children.map((childSize) => {
                return (this.width / this.totalSize) * childSize;
              })
            )
          );
        }
      ),
      reaction(
        () => this.totalFixedWidths,
        () => {
          this.isAnimationActive = true;
        }
      )
    );

  update = (props: ResizableGroupProps) => {
    this.configs = props.configs;
  };
}

export const {
  StoreProvider: ResizableGroupStoreProvider,
  useStore: useResizableGroupStore,
} = getProvider(ResizableGroupStore);
