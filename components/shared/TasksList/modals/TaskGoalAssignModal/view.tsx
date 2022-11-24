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
import { useTaskGoalAssignModalStore } from './store';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import React from 'react';
import { GoalsSelection } from '../../../GoalsSelection';
import { useNavigationByRefs } from '../../../../../helpers/useNavigationByRefs';

export const TaskGoalAssignModalView = observer(
  function TaskGoalAssignModalView() {
    const store = useTaskGoalAssignModalStore();

    const ref = useHotkeysHandler(store.keyMap, store.hotkeyHandlers);
    const { handleFocus, handleKeyDown, setRefs } = useNavigationByRefs(
      store.navigationCallbacks
    );

    return (
      <Modal isCentered isOpen={true} onClose={store.callbacks.onClose}>
        <ModalOverlay />
        <ModalContent
          ref={(el) => (ref.current = el)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        >
          <ModalHeader>My goals</ModalHeader>
          <ModalBody maxH={80} overflow='scroll' pl={5} pr={5}>
            <GoalsSelection
              goals={store.goals}
              setRefs={setRefs}
              checked={store.selectedGoalId ? [store.selectedGoalId] : []}
              callbacks={{
                onSelect: store.handleSelect,
                onGoalCreateClick: store.callbacks.onGoalCreateClick,
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
