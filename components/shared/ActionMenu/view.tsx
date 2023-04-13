import {
  Button,
  Popover,
  PopoverTrigger,
  useDisclosure
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { observer } from "mobx-react-lite";
import { ActionMenuViewProps } from "./types";
import { useActionMenuStore } from './store';
import { ActionMenuContent } from "./components/ActionMenuContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/pro-regular-svg-icons";

export const ActionMenuView = observer(
  function ActionMenu({
    hidden,
    isOpenByContextMenu,
    triggerButtonProps,
    triggerIconFontSize,
    customTrigger,
    menuMinWidth,
    triggerIcon = faEllipsis
  }: ActionMenuViewProps) {
    const store = useActionMenuStore();

    const { isOpen, onClose, onOpen } = useDisclosure({
      isOpen: store.isMenuOpen,
    });
    const [isAnimationInProcess, setIsAnimationInProcess] = useState(false);

    const stopAnimation = useCallback(() => {
      setIsAnimationInProcess(false);
    }, [setIsAnimationInProcess]);

    const close = useCallback(() => {
      !isOpenByContextMenu && setIsAnimationInProcess(true);
      onClose();
      store.closeMenu();
    }, [isOpenByContextMenu, onClose, store]);

    const open = useCallback(() => {
      setIsAnimationInProcess(true);
      onOpen();
      store.openMenu();
    }, [onOpen, store]);

    return (
      <Popover
        isLazy
        isOpen={isOpen || isAnimationInProcess}
        strategy='fixed'
        eventListeners={{
          resize: true
        }}
        modifiers={[
          {
            name: 'preventOverflow',
            options: {
              tether: false,
              altAxis: true,
              padding: 8,
              boundary: 'clippingParents',
              rootBoundary: 'viewport'
            }
          }
        ]}
        placement='bottom-start'
        onOpen={open}
        onClose={close}
      >
        <PopoverTrigger>
          {customTrigger ? customTrigger(isOpen) : (
            <Button
              size='xs'
              h='auto'
              minW={5}
              w={5}
              p={0}
              variant='unstyled'
              borderRadius='none'
              visibility={hidden ? 'hidden' : 'visible'}
              onClick={(e) => e.stopPropagation()}
              {...triggerButtonProps(isOpen)}
            >
              <FontAwesomeIcon icon={triggerIcon} fontSize={triggerIconFontSize} fixedWidth />
            </Button>
          )}
        </PopoverTrigger>
        {(isOpen || isAnimationInProcess) && (
          <ActionMenuContent isOpen={isOpen} stopAnimation={stopAnimation} menuMinWidth={menuMinWidth} />
        )}
      </Popover>
    );
  }
);
