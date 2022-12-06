export type ResizableBlocksItemData = {
  id: string;
  containerId: string;
  start: number;
  duration: number;
  fromLevel: number;
  toLevel: number;
  totalLevels: number;
};

export type ResizableBlocksItemPosData = {
  id: string;
  containerId: string;
  y: number;
  height: number;
  isTemp?: boolean;
  fromLevel: number;
  toLevel: number;
  totalLevels: number;
};
