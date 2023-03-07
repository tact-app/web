import { MutableRefObject } from 'react';

export type TOnFinish = (items: Element[], e: MouseEvent) => void;
export type TOnStart = (e: MouseEvent) => void;

export interface MouseMultySelectProps {
  containerRef?: MutableRefObject<HTMLElement | null>;
  portal?: MutableRefObject<HTMLElement | null>;
  minFramePx?: number;
  minItemPx? : number;
  edgeSize? : number;
  onClickPreventDefault?: boolean;
  itemClassName?: string
  selectedItemClassName?: string;
  frameClassName?: string;
  openFrameClassName?: string;
  notStartWithSelectableElements?: boolean;
  saveSelectAfterFinish?: boolean;
  onStartSelection?: TOnStart;
  onFinishSelection?: TOnFinish;
}

export interface HandleSelectionOptions {
  selectedItemClassName: string;
  minItemPx: number;
  saveSelectAfterFinish: boolean;
  isOpenRef: MutableRefObject<boolean>;
}

export interface MouseMovePosition {
  startX: number;
  startY: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ElementPosition {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
