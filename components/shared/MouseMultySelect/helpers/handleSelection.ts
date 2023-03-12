import { throttle } from './throttle';

import { selectionCheck } from './selectionСheck';
import { ElementPosition, HandleSelectionOptions, MouseMovePosition } from '../types';

export const handleSelection = (
  elements: HTMLCollection, currPositions: MouseMovePosition, options: HandleSelectionOptions
) => throttle(() => {
  const position: ElementPosition = {
    top: currPositions.y,
    bottom: currPositions.y + currPositions.height,
    left: currPositions.x,
    right: currPositions.x + currPositions.width,
  }

  for (let i = 0; i < elements.length; i++) {
    const item = elements[i];

    if (!options.isOpenRef.current) {
      if (!options.saveSelectAfterFinish) {
        item.classList.remove(options.selectedItemClassName);
      }
      continue;
    }

    const itemPosition = item.getBoundingClientRect();
    const alreadySelected = item.classList.contains(options.selectedItemClassName);

    const elementPosition: ElementPosition = {
      top: itemPosition.top + window.scrollY,
      bottom: itemPosition.bottom + window.scrollY,
      left: itemPosition.left,
      right: itemPosition.right,
    }

    const isSelected = selectionCheck(elementPosition, position, options.minItemPx);

    if (isSelected && !alreadySelected) item.classList.add(options.selectedItemClassName);
    if (!isSelected && alreadySelected) item.classList.remove(options.selectedItemClassName);
  }
}, 100)
