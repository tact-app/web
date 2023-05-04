import {
  Button,
  Popover,
  PopoverTrigger,
  chakra,
} from '@chakra-ui/react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useSpaceSelectStore } from './store';
import { SpacesSmallIcon } from "../../pages/Spaces/components/SpacesIcons/SpacesSmallIcon";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ModalsSwitcher } from "../../../helpers/ModalsController";
import { Tooltip } from '../Tooltip';
import { SpaceSelectContent } from './components/SpaceSelectContent';

export const SpaceSelectView = observer(function SpaceSelectView() {
  const store = useSpaceSelectStore();

  return (
    <chakra.div display='flex' role='group' onKeyDown={store.handleContainerKeyDown}>
      <Popover
        isLazy
        strategy='fixed'
        placement='bottom-start'
        closeOnEsc={false}
        onOpen={store.openMenu}
        onClose={store.closeMenu}
        isOpen={store.isMenuOpen}
      >
        <PopoverTrigger>
          <div onKeyDown={store.handleTriggerButtonKeyDown}>
            <Tooltip label='Change space' isDisabled={store.isMenuOpen || store.isCreateModalOpened}>
              <Button
                ref={store.setTriggerRef}
                p={.5}
                h='auto'
                bg={store.isMenuOpen ? store.selectedSpace.hoverColor : 'transparent'}
                _focus={{ bg: store.selectedSpace.hoverColor }}
                _focusVisible={{ boxShadow: 'none' }}
                _groupHover={{ bg: store.selectedSpace.hoverColor }}
                onFocus={store.handleTriggerFocus}
                onBlur={store.handleTriggerBlur}
                role='group'
              >
                <chakra.div display='flex' w='100%' h='100%' alignItems='center'>
                  <SpacesSmallIcon space={store.selectedSpace} size={6} borderRadius={4} bgOpacity='100' />
                  <chakra.span ml={1} mr={1.5} fontWeight='normal' fontSize='sm' overflow='hidden' textOverflow='ellipsis'>
                    {store.selectedSpace.name}
                  </chakra.span>
                </chakra.div>
              </Button>
            </Tooltip>
          </div>
        </PopoverTrigger>
        <SpaceSelectContent />
      </Popover>

      <Tooltip label='Go to space' hotkey='Press G and then S'>
        <Button
          ref={store.setGoToSpaceButtonRef}
          tabIndex={-1}
          colorScheme='gray'
          variant='outline'
          ml={2}
          w={7}
          h={7}
          display='flex'
          alignItems='center'
          justifyContent='center'
          p={0}
          minW={0}
          opacity={store.isMenuOpen || store.isTriggerFocused || store.isGoToSpaceButtonFocused ? 1 : 0}
          color='gray.400'
          _groupHover={{ opacity: 1 }}
          onClick={store.goToSpace}
          onKeyDown={store.handleGoToSpaceButtonKeyDown}
          onFocus={store.handleGoToSpaceButtonFocus}
          onBlur={store.handleGoToSpaceButtonBlur}
        >
          <FontAwesomeIcon icon={faAngleRight} fontSize={20} />
        </Button>
      </Tooltip>

      <ModalsSwitcher controller={store.controller} />
    </chakra.div>
  );
});
