import {
  Button,
  Popover,
  PopoverTrigger,
  useDisclosure
} from "@chakra-ui/react";
import React from "react";
import { observer } from "mobx-react-lite";
import { ActionMenuViewProps } from "./types";
import { useActionMenuStore } from './store';
import { ActionMenuContent } from "./components/ActionMenuContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/pro-regular-svg-icons";

export const ActionMenuView = observer(
  function ActionMenu({
    hidden,
    triggerButtonProps,
    triggerIconFontSize,
    customTrigger,
    menuMinWidth,
    triggerIcon = faEllipsis
  }: ActionMenuViewProps) {
    const store = useActionMenuStore();

    const { isOpen, onClose, onOpen } = useDisclosure({
      isOpen: store.isMenuOpen,
      onOpen: store.openMenu,
      onClose: store.closeMenu,
    });

    return (
      <Popover
        isLazy
        isOpen={isOpen}
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
        onOpen={onOpen}
        onClose={onClose}
      >
        <PopoverTrigger>
          {customTrigger ? customTrigger(isOpen) : (
            <Button
              size='xs'
              h='100%'
              minW={5}
              w={5}
              p={0}
              variant='unstyled'
              borderRadius='none'
              visibility={hidden ? 'hidden' : 'visible'}
              onClick={store.preventEventsPropagation}
              {...triggerButtonProps?.(isOpen)}
            >
              <FontAwesomeIcon icon={triggerIcon} fontSize={triggerIconFontSize} fixedWidth />
            </Button>
          )}
        </PopoverTrigger>
        <ActionMenuContent isOpen={isOpen} menuMinWidth={menuMinWidth} />
      </Popover>
    );
  }
);
