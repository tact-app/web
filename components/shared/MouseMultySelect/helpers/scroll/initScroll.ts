import { checkForWindowScroll } from './checkForWindowScroll';

let _timer: any = null;

export const initScroll = (e: MouseEvent, edgeSize: number) => {
  const viewportX = e.clientX;
  const viewportY = e.clientY;

  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;

  const edgeTop = edgeSize;
  const edgeLeft = edgeSize;
  const edgeBottom = ( viewportHeight - edgeSize );
  const edgeRight = ( viewportWidth - edgeSize );

  const isInLeftEdge = ( viewportX < edgeLeft );
  const isInRightEdge = ( viewportX > edgeRight );
  const isInTopEdge = ( viewportY < edgeTop );
  const isInBottomEdge = ( viewportY > edgeBottom );

  if (!( isInLeftEdge || isInRightEdge || isInTopEdge || isInBottomEdge)) {
    clearTimeout( _timer );
    return;
  }

  const documentWidth = Math.max(
    document.body.scrollWidth,
    document.body.offsetWidth,
    document.body.clientWidth,
    document.documentElement.scrollWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.body.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );

  const maxScrollX = ( documentWidth - viewportWidth );
  const maxScrollY = ( documentHeight - viewportHeight );

  checkForWindowScroll({
    maxScrollY,
    maxScrollX,
    isInLeftEdge,
    isInRightEdge,
    isInTopEdge,
    isInBottomEdge,
    edgeLeft,
    edgeRight,
    edgeTop,
    edgeBottom,
    viewportX,
    viewportY,
    edgeSize,
  })
}
