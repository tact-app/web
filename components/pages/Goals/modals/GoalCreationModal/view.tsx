import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Text,
  Box, Center, Heading
} from '@chakra-ui/react';
import { useGoalCreationModalStore } from './store';
import { BackArrowIcon } from '../../../../shared/Icons/BackArrowIcon';
import { GoalCreationStepsSwitcher } from './components/GoalCreationStepsSwitcher';
import { GoalCreationModalSteps } from './types';
import { GlobalHotKeys } from 'react-hotkeys';
import { GoalCreationEmojiSelect } from './components/GoalCreationEmojiSelect';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@chakra-ui/modal';

const keyMap = {
  CREATE: ['cmd+enter', 'cmd+s'],
  CANCEL: ['esc'],
};

export const GoalCreationModalView = observer(function GoalCreationModal() {
  const store = useGoalCreationModalStore();

  return (
    <GlobalHotKeys
      keyMap={keyMap}
      handlers={store.hotkeyHandlers}
    >
      <Modal
        isOpen={store.isOpen}
        onClose={store.handleClose}
        onCloseComplete={store.handleCloseComplete}
        closeOnEsc={false}
        onEsc={store.handleBack}
        blockScrollOnMount={false}
        size='full'
      >
        <ModalContent>
          <ModalHeader position='relative' display='flex' alignItems='center' flexDirection='row'>
            <Button variant='ghost' size='xs' onClick={store.handleBack} position='absolute'>
              <BackArrowIcon/>
              <Text fontSize='lg' color='gray.400'
                    fontWeight='normal'
              >
                Back
              </Text>
            </Button>
            <Center flex={1} minH={12}>
              {store.step === GoalCreationModalSteps.FILL_DESCRIPTION ? (
                <GoalCreationEmojiSelect/>
              ) : null}
              <Heading variant='h1' fontSize='2rem'>Goal setting</Heading>
            </Center>
            {
              store.step === GoalCreationModalSteps.FILL_DESCRIPTION ? (
                <Box display='flex' alignItems='center' position='absolute' right={6}>
                  <Text fontSize='xs' fontWeight='normal' mr={4} color='gray.400'>Press ⌘ S </Text>
                  <Button
                    colorScheme='blue'
                    size='sm'
                    disabled={!store.isReadyForSave}
                    onClick={store.handleSave}
                  >Save</Button>
                </Box>
              ) : null
            }
          </ModalHeader>
          <ModalBody pb={6} overflow='scroll' position='relative'>
            <GoalCreationStepsSwitcher/>
          </ModalBody>
          <ModalFooter/>
        </ModalContent>
      </Modal>
    </GlobalHotKeys>
  );
});
