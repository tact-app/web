import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Text,
  Box,
  Center,
  Heading,
  Input,
  HStack,
  VStack,
  Container,
  Divider,
} from '@chakra-ui/react';
import { useSpaceCreationModalStore } from './store';
import { BackArrowIcon } from '../../../../shared/Icons/BackArrowIcon';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import { SpaceCreationColorSelect } from './components/SpaceCreationColorSelect';
import { SpaceCreationAccountSelect } from './components/SpaceCreationAccountSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/pro-regular-svg-icons';

const keyMap = {
  CREATE: ['meta+enter', 'meta+s', 'ctrl+enter', 'ctrl+s'],
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
              {store.existedSpace ? 'Edit' : 'Create'} space
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
          <Container maxW='2xl'>
            <VStack>
              <SpaceCreationAccountSelect />
              <HStack
                overflow='visible'
                display='flex'
                m='auto'
                w='100%'
                spacing={6}
                alignItems='end'
              >
                <Box flex={1}>
                  <Text fontSize='lg' fontWeight='semibold'>
                    Name
                  </Text>
                  <Input
                    size='lg'
                    value={store.name}
                    autoFocus
                    placeholder='Space name'
                    onChange={store.handleNameChange}
                    variant='flushed'
                  />
                </Box>
                <Input
                  size='lg'
                  value={store.shortName}
                  placeholder='-'
                  w={10}
                  maxLength={1}
                  onChange={store.handleShortNameChange}
                  variant='flushed'
                />
              </HStack>
            </VStack>
          </Container>
        </ModalBody>
        <ModalFooter>
          {store.existedSpace && store.existedSpace.type !== 'personal' && (
            <Container maxW='2xl'>
              <Divider />
              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                pb={10}
                pt={4}
              >
                <Box display='flex' alignItems='center'>
                  <FontAwesomeIcon icon={faTrash} fixedWidth />
                  <Text fontSize='sm' fontWeight='normal'>
                    Delete space
                  </Text>
                </Box>
                <Button
                  onClick={store.openConfirmationDelete}
                  variant='outline'
                  borderWidth='2px'
                  colorScheme='blue'
                  borderColor='blue.400'
                  color='blue.400'
                  size='xs'
                >
                  Delete
                </Button>
              </Box>
            </Container>
          )}
        </ModalFooter>
      </ModalContent>

      <Modal
        isOpen={store.isDeleteConfirmationOpen}
        onClose={store.closeDeleteConfirmation}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm deletion</ModalHeader>
          <ModalBody>Are you sure?</ModalBody>
          <ModalFooter>
            <Button
              colorScheme='gray'
              variant='ghost'
              mr={3}
              onClick={store.closeDeleteConfirmation}
            >
              Cancel
            </Button>
            <Button colorScheme='red' onClick={store.confirmDeletion}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Modal>
  );
});
