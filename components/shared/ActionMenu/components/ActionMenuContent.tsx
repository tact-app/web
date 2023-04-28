import { observer } from "mobx-react-lite";
import { useActionMenuStore } from "../store";
import React, { useMemo } from "react";
import { useListNavigation } from "../../../../helpers/ListNavigation";
import { Fade, PopoverBody, PopoverContent, Portal } from "@chakra-ui/react";
import { ActionMenuItems } from "./ActionMenuItems";
import { PopoverWrapper } from '../../TasksList/components/TaskItemMenu/PopoverWrapper';

type Props = {
  isOpen: boolean;
  stopAnimation(): void;
  menuMinWidth?: number;
};

export const ActionMenuContent = observer(function ActionMenuContent({
  isOpen,
  stopAnimation,
  menuMinWidth = 72
}: Props) {
  const store = useActionMenuStore();

  const { keyMap, hotkeyHandlers } = useMemo(() => {
    const keyMap = {};
    const hotkeyHandlers = {};

    store.items.forEach((item, index) => {
      if (item && item.hotkey) {
        keyMap[index] = item.hotkey;
        hotkeyHandlers[index] = () => {
          store.closeMenu();
          item.onClick();
        };
      }
    });

    return { keyMap, hotkeyHandlers };
  }, [store.items, store.closeMenu]); // eslint-disable-line react-hooks/exhaustive-deps

  useListNavigation(store.menuNavigation, keyMap, hotkeyHandlers);

  return (
    <Portal>
      <PopoverWrapper
          isOpen={store.isMenuOpen}
          positionByMouse={store.isOpenByContextMenu}
          left={store.xPosContextMenu}
      >
        <Fade in={isOpen} unmountOnExit onAnimationComplete={stopAnimation}>
          <PopoverContent
              tabIndex={-1}
              p={0}
              shadow='lg'
              overflow='hidden'
              w='auto'
              minW={menuMinWidth}
              onFocus={store.menuNavigation.handleFocus}
          >
            <PopoverBody p={0}>
              <ActionMenuItems
                  refs={store.menuNavigation.setRefs}
                  items={store.items}
                  onClose={store.closeMenu}
              />
            </PopoverBody>
          </PopoverContent>
        </Fade>
      </PopoverWrapper>
    </Portal>
  );
});
