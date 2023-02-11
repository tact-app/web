import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { Button, Text } from '@chakra-ui/react';
import { useTaskSpaceChangeModalStore } from './store';
import { SpacesSelection } from '../../../SpacesSelection';
import { useListNavigation } from '../../../../../helpers/ListNavigation';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';

export const TaskSpaceChangeModalView = observer(
  function TaskSpaceChangeModalView() {
    const store = useTaskSpaceChangeModalStore();

    useListNavigation(store.navigation);
    useHotkeysHandler(store.keyMap, store.hotkeyHandlers)

    return (
      <Modal isCentered isOpen={true} onClose={store.callbacks.onClose}>
        <ModalOverlay />
        <ModalContent
          onFocus={store.navigation.handleFocus}
        >
          <ModalHeader>My spaces</ModalHeader>
          <ModalBody maxH={80} overflow='scroll' pl={5} pr={5}>
            <SpacesSelection
              setRefs={store.navigation.setRefs}
              checked={store.selectedSpaceId ? [store.selectedSpaceId] : []}
              callbacks={{
                onSelect: store.handleSelect,
                onSpaceCreateClick: store.callbacks.onSpaceCreateClick,
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={store.callbacks.onClose}
              display='flex'
              flexDirection='row'
            >
              Cancel
              <Text ml={1} fontSize='xs' color='blackAlpha.500'>
                Esc
              </Text>
            </Button>
            <Button
              colorScheme='blue'
              onClick={store.handleSubmit}
              display='flex'
              flexDirection='row'
            >
              Save
              <Text ml={1} fontSize='xs' color='whiteAlpha.700'>
                ⌘ + Enter
              </Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);
