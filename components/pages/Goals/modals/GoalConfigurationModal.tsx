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
import { GoalConfigurationProps } from '../components/GoalConfiguration/store';
import { GoalConfiguration } from '../components/GoalConfiguration';

export type GoalConfigurationModalProps = {
  onClose: () => void
} & GoalConfigurationProps

export const GoalConfigurationModal = observer(function GoalConfigurationModal({
                                                                                 onClose,
                                                                                 ...props
                                                                               }: GoalConfigurationModalProps) {
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
        <ModalHeader>Goal configuration</ModalHeader>
        <ModalBody pb={6}>
          <GoalConfiguration {...props}/>
        </ModalBody>

        <ModalFooter display='flex' justifyContent='flex-end'>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
