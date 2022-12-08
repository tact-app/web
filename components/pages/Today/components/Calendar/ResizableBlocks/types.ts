export type ResizableBlocksItemData = {
  id: string;
  color: string;
  start: number;
  end: number;
};

export type ResizableBlocksItemPosData = {
  id: string;
  containerId: string;
  color: string;
  y: number;
  height: number;
  isTemp?: boolean;
  fromLevel: number;
  toLevel: number;
  totalLevels: number;
  isFocused?: boolean;
};
