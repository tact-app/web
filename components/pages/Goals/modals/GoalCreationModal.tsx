import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/modal';

export type GoalCreationModalProps = {
  onClose: () => void
}

export const GoalCreationModal = observer(function GoalCreationModal({
                                                                   onClose,
                                                                 }: GoalCreationModalProps) {
  const initialRef = useRef(null);

  return (
    <Modal
      isCentered
      initialFocusRef={initialRef}
      isOpen={true}
      onClose={onClose}
    >
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>Delete task</ModalHeader>
        <ModalBody pb={6}>
        </ModalBody>

        <ModalFooter display='flex' justifyContent='flex-end'>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});