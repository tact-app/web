export enum ResizableBlocksTypes {
  SOLID = 'SOLID',
  STROKED = 'STROKED',
  GHOST = 'GHOST',
}

export type ResizableBlocksItemData = {
  id: string;
  color: string;
  start: number;
  end: number;
  type: ResizableBlocksTypes;
  data?: any;
};

export type ResizableBlocksDropItemData = {
  color: string;
  type: ResizableBlocksTypes;
  data?: any;
};

export type ResizableBlocksItemPosData = {
  id: string;
  containerId: string;
  color: string;
  type: ResizableBlocksTypes;
  y: number;
  height: number;
  isTemp?: boolean;
  fromLevel: number;
  toLevel: number;
  totalLevels: number;
  isFocused?: boolean;
  data?: any;
};
