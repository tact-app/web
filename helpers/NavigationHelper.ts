import { NavigationDirections } from '../types/navigation';

function castKeyToDirection(key: string, withShift?: boolean) {
  switch (key) {
    case 'ArrowDown':
      return NavigationDirections.DOWN;
    case 'Tab':
      if (withShift) {
        return NavigationDirections.BACK;
      }

      return NavigationDirections.TAB;
    case 'ArrowUp':
      return NavigationDirections.UP;
    case 'ArrowLeft':
      return NavigationDirections.LEFT;
    case 'ArrowRight':
      return NavigationDirections.RIGHT;
    case 'Enter':
      return NavigationDirections.ENTER;
    case 'Escape':
      return NavigationDirections.INVARIANT;
    default:
      return;
  }
}

export const NavigationHelper = {
  castKeyToDirection
};
