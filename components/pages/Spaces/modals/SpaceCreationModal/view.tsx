import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Text, Box, Center, Heading, Input } from '@chakra-ui/react';
import { useSpaceCreationModalStore } from './store';
import { BackArrowIcon } from '../../../../shared/Icons/BackArrowIcon';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@chakra-ui/modal';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import { SpaceCreationColorSelect } from './components/SpaceCreationColorSelect';

const keyMap = {
  CREATE: ['cmd+enter', 'cmd+s'],
  CANCEL: ['esc'],
};

export const SpaceCreationModalView = observer(function SpaceCreationModal() {
  const store = useSpaceCreationModalStore();

  useHotkeysHandler(keyMap, store.hotkeyHandlers);

  return (
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
        <ModalHeader
          position='relative'
          display='flex'
          alignItems='center'
          flexDirection='row'
        >
          <Button
            variant='ghost'
            size='xs'
            onClick={store.handleBack}
            position='absolute'
          >
            <BackArrowIcon />
            <Text fontSize='lg' color='gray.400' fontWeight='normal'>
              Back
            </Text>
          </Button>
          <Center flex={1} minH={12}>
            <SpaceCreationColorSelect />
            <Heading variant='h1' fontSize='2rem'>
              Create space
            </Heading>
          </Center>
          <Box display='flex' alignItems='center' position='absolute' right={6}>
            <Text fontSize='xs' fontWeight='normal' mr={4} color='gray.400'>
              Press ⌘ S{' '}
            </Text>
            <Button
              colorScheme='blue'
              size='sm'
              disabled={!store.isReadyForSave}
              onClick={store.handleSave}
            >
              Save
            </Button>
          </Box>
        </ModalHeader>
        <ModalBody pb={6} overflow='scroll' position='relative'>
          <Box
            maxW='2xl'
            overflow='visible'
            position='absolute'
            left={0}
            right={0}
            m='auto'
          >
            <Input
              size='lg'
              value={store.name}
              autoFocus
              placeholder='Space name'
              onChange={store.handleNameChange}
              variant='flushed'
            />
          </Box>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
});
