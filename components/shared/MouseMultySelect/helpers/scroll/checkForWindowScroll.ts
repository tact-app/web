import { adjustWindowScroll } from './adjustWindowScroll';
import { CoordinatesAndDimensions } from './types';

let _timer: any = null;

export const checkForWindowScroll = (coordinatesAndDimensions: CoordinatesAndDimensions) => {
  (function _check() {
    clearTimeout(_timer);
    if (adjustWindowScroll(coordinatesAndDimensions)) {
      _timer = setTimeout( _check, 50 );
    }
  })()
}

export const clearTimer = () => clearTimeout(_timer);
