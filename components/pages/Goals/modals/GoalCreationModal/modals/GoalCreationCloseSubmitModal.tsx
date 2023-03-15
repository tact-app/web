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
import { Button } from "@chakra-ui/react";
import { ButtonHotkey } from "../../../../../shared/ButtonHotkey";

export type GoalCreationCloseSubmitModalProps = {
  onClose(): void;
  onSubmit(): void;
};

export const GoalCreationCloseSubmitModal = observer(
  function GoalCreationCloseSubmitModal({ onClose, onSubmit }: GoalCreationCloseSubmitModalProps) {
    const initialRef = useRef(null);

    return (
      <Modal
        isCentered
        initialFocusRef={initialRef}
        isOpen
        closeOnEsc={false}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your goal have not been saved</ModalHeader>
          <ModalBody pt={4} pb={6}>
            Are you sure you would like to exit the editor?
          </ModalBody>

          <ModalFooter display='flex' justifyContent='flex-end' pt={0}>
            <Button mr={3} variant='ghost' size='sm' onClick={onSubmit}>
              Exit
              <ButtonHotkey hotkey='Esc' />
            </Button>
            <Button colorScheme='blue' size='sm' onClick={onClose} ref={initialRef}>
              Stay here
              <ButtonHotkey hotkey='⌘+Enter' />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);
