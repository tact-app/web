import { NavigationDirections } from '../components/shared/TasksList/types';

function castKeyToDirection(key: string) {
  switch (key) {
    case 'ArrowDown':
      return NavigationDirections.DOWN;
    case 'Tab':
      return NavigationDirections.DOWN;
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
