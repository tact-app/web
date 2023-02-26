import { CoordinatesAndDimensions } from './types';

export const adjustWindowScroll = (data: CoordinatesAndDimensions) => {
  const currentScrollX = window.pageXOffset;
  const currentScrollY = window.pageYOffset;

  const canScrollUp = ( currentScrollY > 0 );
  const canScrollDown = ( currentScrollY < data.maxScrollY );
  const canScrollLeft = ( currentScrollX > 0 );
  const canScrollRight = ( currentScrollX < data.maxScrollX );

  let nextScrollX = currentScrollX;
  let nextScrollY = currentScrollY;

  const maxStep = 30;

  if (data.isInLeftEdge && canScrollLeft) {
    const intensity = ((data.edgeLeft - data.viewportX) / data.edgeSize);
    nextScrollX = (nextScrollX - (maxStep * intensity));
  } else if (data.isInRightEdge && canScrollRight) {
    const intensity = ((data.viewportX - data.edgeRight) / data.edgeSize);
    nextScrollX = (nextScrollX + (maxStep * intensity));
  }

  if (data.isInTopEdge && canScrollUp) {
    const intensity = ((data.edgeTop - data.viewportY) / data.edgeSize);
    nextScrollY = (nextScrollY - (maxStep * intensity));
  } else if (data.isInBottomEdge && canScrollDown) {
    const intensity = ((data.viewportY - data.edgeBottom) / data.edgeSize);
    nextScrollY = (nextScrollY + (maxStep * intensity));
  }

  nextScrollX = Math.max( 0, Math.min(data.maxScrollX, nextScrollX));
  nextScrollY = Math.max( 0, Math.min(data.maxScrollY, nextScrollY));
  if (nextScrollX !== currentScrollX || nextScrollY !== currentScrollY) {
    window.scrollTo( nextScrollX, nextScrollY );
    return true;
  } else {
    return false;
  }
}
