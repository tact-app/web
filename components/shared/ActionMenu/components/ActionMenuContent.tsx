import { observer } from "mobx-react-lite";
import { useActionMenuStore } from "../store";
import React, { useMemo } from "react";
import { useListNavigation } from "../../../../helpers/ListNavigation";
import { Fade, PopoverBody, PopoverContent, Portal } from "@chakra-ui/react";
import { ActionMenuItems } from "./ActionMenuItems";

type Props = {
  isOpen: boolean;
  stopAnimation(): void;
};

export const ActionMenuContent = observer(function ActionMenuContent({ isOpen, stopAnimation }: Props) {
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
  }, [store.items, store]);

  useListNavigation(store.menuNavigation, keyMap, hotkeyHandlers);

  return (
    <Portal>
      <Fade in={isOpen} unmountOnExit onAnimationComplete={stopAnimation}>
        <PopoverContent
          tabIndex={-1}
          p={0}
          shadow='lg'
          overflow='hidden'
          w='auto'
          minW={72}
          onFocus={store.menuNavigation.handleFocus}
        >
          <PopoverBody p={0}>
            <ActionMenuItems
              refs={store.menuNavigation.setRefs}
              items={store.items}
            />
          </PopoverBody>
        </PopoverContent>
      </Fade>
    </Portal>
  );
});