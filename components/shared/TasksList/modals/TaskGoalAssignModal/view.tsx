import { observer } from 'mobx-react-lite';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { Button, Flex, Text } from '@chakra-ui/react';
import { useTaskGoalAssignModalStore } from './store';
import React from 'react';
import { GoalsSelection } from '../../../GoalsSelection';
import { useListNavigation } from '../../../../../helpers/ListNavigation';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import { isMac } from '../../../../../helpers/os';
import { CloseButton } from "../../../CloseButton";

export const TaskGoalAssignModalView = observer(
  function TaskGoalAssignModalView() {
    const store = useTaskGoalAssignModalStore();

    useListNavigation(store.navigation);
    useHotkeysHandler(store.keyMap, store.hotkeyHandlers);

    return (
      <Modal isCentered isOpen={true} onClose={store.callbacks.onClose}>
        <ModalOverlay />
        <ModalContent
          onFocus={store.navigation.handleFocus}
          mt='auto'
          mb='auto'
          maxH='90%'
        >
          <ModalHeader>
            <Flex justifyContent='space-between' alignItems='center'>
              {store.initialGoalId ? 'Change goal' : 'Set goal'}
              {store.taskCount > 1 && store.root.resources.goals.haveGoals && (
                <Text color='gray.400' fontSize='sm' fontWeight='normal'>
                  Selected: {store.taskCount} tasks
                </Text>
              )}
              {!store.root.resources.goals.haveGoals && <CloseButton onlyIcon onClick={store.callbacks.onClose} />}
            </Flex>
          </ModalHeader>
          <ModalBody
            overflow='auto'
            pl={5}
            pr={5}
            pb={store.root.resources.goals.haveGoals ? 0 : 8}
          >
            <GoalsSelection
              forModal
              checked={[store.selectedGoalId]}
              hasInitialChecked={Boolean(store.initialGoalId)}
              callbacks={{
                setRefs: store.navigation.setRefs,
                onSelect: store.handleSelect,
                onGoalCreateClick: store.callbacks.onGoalCreateClick,
              }}
            />
          </ModalBody>
          {store.root.resources.goals.haveGoals && (
            <ModalFooter display='flex' justifyContent='flex-end'>
              <Button
                mr={3}
                onClick={store.callbacks.onClose}
                display='flex'
                flexDirection='row'
                variant='ghost'
                color='blue.400'
                size='sm'
              >
                Cancel
                <Text
                  ml={1}
                  fontSize='xs'
                  color='blue.400'
                  fontWeight={400}
                >
                  Esc
                </Text>
              </Button>
              <Button
                bg='blue.400'
                color='white'
                onClick={store.handleSubmit}
                display='flex'
                flexDirection='row'
                size='sm'
              >
                Save
                <Text
                  ml={1}
                  fontSize='xs'
                  color='white'
                  fontWeight={400}
                >
                  {`${isMac() ? '⌘' : 'Ctrl'} + Enter`}
                </Text>
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    );
  }
);
