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
import { Button } from '@chakra-ui/react';

export type TaskDeleteModalProps = {
  onClose: () => void
  onDelete: () => void
}

export const TaskDeleteModal = observer(function TaskDeleteModal({
                                                                   onClose,
                                                                   onDelete
                                                                 }: TaskDeleteModalProps) {
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
          Are you sure you would like to delete this task?
        </ModalBody>

        <ModalFooter display='flex' justifyContent='flex-end'>
          <Button mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme='red' onClick={onDelete} ref={initialRef}>Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
