import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  chakra,
  ChakraProps,
} from '@chakra-ui/react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { usePropertyMenuStore } from './store';
import { SpacesSmallIcon } from "../../pages/Spaces/components/SpacesIcons/SpacesSmallIcon";
import { faCheck } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HeavyPlusIcon } from "../Icons/HeavyPlusIcon";

export const SUGGESTIONS_MENU_ID = 'task-quick-editor-suggestions';

export const PropertyMenuView = observer(function PropertyMenuView() {
  const store = usePropertyMenuStore();

  const renderContent = () => {
    if (!store.spaces.length) {
      return (
        <chakra.span
          display='flex'
          alignItems='center'
          justifyContent="center"
          color='gray.500'
          textAlign='center'
          p={5}
        >
          You haven&apos;t created any space yet
        </chakra.span>
      );
    }

    const itemContainerProps: ChakraProps = {
      pt: 1.5,
      pb: 1.5,
      pr: 5,
      pl: 4,
      w: '100%',
      display: 'flex',
      position: 'relative',
      cursor: 'pointer',
      _hover: { bg: 'gray.100' },
    };

    return [
      ...store.spaces.map((space) => (
        <chakra.div
          {...itemContainerProps}
          key={space.id}
          onClick={() => store.handleSuggestionSelect(space.id)}
        >
          <chakra.div display='flex' alignItems='center'>
            <SpacesSmallIcon space={space} size={7} borderRadius={4} bgOpacity='.100' />
            <chakra.span color={space.isSelected ? 'blue.400' : 'gray.700'} ml={2} mr={2} overflow='hidden' textOverflow='ellipsis'>
              {space.name}
            </chakra.span>
          </chakra.div>

          {space.isSelected && (
            <chakra.span position='absolute' color='blue.400' top='50%' transform='translate(0, -50%)' right={2.5}>
              <FontAwesomeIcon
                fontSize={14}
                icon={faCheck}
                fixedWidth
              />
            </chakra.span>
          )}
        </chakra.div>
      )),
      <chakra.div
        {...itemContainerProps}
        key='create-space'
      >
        <chakra.div display='flex' alignItems='center'>
          <chakra.div w={7} h={7} rounded='full' display='flex' alignItems='center' justifyContent='center' bg='gray.75'>
            <HeavyPlusIcon />
          </chakra.div>
          <chakra.span ml={2} mr={2}>Create new space</chakra.span>
        </chakra.div>
      </chakra.div>
    ]
  };

  return (
    <Popover
      placement='bottom-start'
      isLazy
      autoFocus={false}
      isOpen={store.isMenuOpen}
    >
      <PopoverTrigger>
        <Button
          p={.5}
          h='auto'
          display='flex'
          bg={store.isMenuOpen ? store.selectedSpace.hoverColor : 'transparent'}
          _hover={{ bg: store.selectedSpace.hoverColor }}
          onClick={store.toggleMenu}
        >
          <SpacesSmallIcon space={store.selectedSpace} size={6} borderRadius={4} bgOpacity='.100' />
          <chakra.span ml={1} mr={1.5} fontWeight='normal' fontSize='sm' overflow='hidden' textOverflow='ellipsis'>
            {store.selectedSpace.name}
          </chakra.span>
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          data-id={SUGGESTIONS_MENU_ID}
          onClick={(e) => e.stopPropagation()}
          p={0}
          boxShadow='lg'
          minW={32}
          maxW={72}
          width='auto'
          overflow='hidden'
        >
          <PopoverBody p={0} maxH={64} overflow='auto'>
            {renderContent()}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
});
