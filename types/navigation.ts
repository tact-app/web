export enum NavigationDirections {
  UP = 'up',
  DOWN = 'down',
  ENTER = 'enter',
  LEFT = 'left',
  RIGHT = 'right',
  INVARIANT = 'invariant',
}

export type NavigationArrows = (
  NavigationDirections.UP |
  NavigationDirections.DOWN |
  NavigationDirections.LEFT |
  NavigationDirections.RIGHT
);
