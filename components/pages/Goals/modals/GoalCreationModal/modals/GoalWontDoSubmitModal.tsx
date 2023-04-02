import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { Button, chakra, Checkbox, ListItem, List } from "@chakra-ui/react";
import { ButtonHotkey } from "../../../../../shared/ButtonHotkey";
import { useHotkeysHandler } from "../../../../../../helpers/useHotkeysHandler";

export type GoalCreationCloseSubmitModalProps = {
  onClose(): void;
  onSubmit(): void;
};

export const GoalWontDoSubmitModal = observer(
  function GoalWontDoSubmitModal({ onClose, onSubmit }: GoalCreationCloseSubmitModalProps) {
    const initialRef = useRef(null);

    useHotkeysHandler({ STAY: ['meta+enter'] }, { STAY: onClose });

    return (
      <Modal
        isCentered
        initialFocusRef={initialRef}
        isOpen
        onEsc={onClose}
        closeOnEsc={false}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Why you won&lsquo;t do this goal?</ModalHeader>
          <ModalBody pt={4} pb={6}>
            <List>
              <ListItem
                h={10}
                display='flex'
                alignItems='center'
                borderBottom='1px'
                borderColor='gray.100'
              >
                <Checkbox
                  // isChecked={!!store.checkedGoals[id]}
                  // onChange={() => store.handleGoalCheck(index)}
                  size='xl'
                  position='relative'
                  fontWeight='semibold'
                  fontSize='lg'
                  width='100%'
                  icon={<></>}
                  css={{
                    '.chakra-checkbox__label': {
                      width: 'calc(100% - 2rem)',
                    }
                  }}
                >
                  <chakra.span
                    position='absolute'
                    left={0}
                    w={6}
                    top={0}
                    bottom={0}
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    // color={store.checkedGoals[id] ? 'white' : 'gray.400'}
                  >
                    1
                  </chakra.span>
                  <chakra.span
                    display='flex'
                    alignItems='center'
                    fontSize='sm'
                    fontWeight='normal'
                  >
                    Test
                  </chakra.span>
                </Checkbox>
              </ListItem>
            </List>
          </ModalBody>

          <ModalFooter display='flex' justifyContent='flex-end' pt={0}>
            <Button mr={3} variant='ghost' size='sm' onClick={onClose}>
              Cancel
              <ButtonHotkey hotkey='Esc' />
            </Button>
            <Button colorScheme='blue' size='sm' onClick={onSubmit} ref={initialRef}>
              Save
              <ButtonHotkey hotkey='⌘+Enter' />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);
