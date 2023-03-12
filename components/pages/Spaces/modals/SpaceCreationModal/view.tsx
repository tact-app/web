import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Text,
  Box,
  Input,
  HStack,
  VStack,
  Container,
  Textarea,
  IconButton,
} from '@chakra-ui/react';
import { useSpaceCreationModalStore } from './store';
import { SpaceCreationEmojiSelect } from './components/SpaceCreationEmojiSelect';
import { DeleteSpaceModal } from './components/DeleteSpaceModal';
import { SpaceСongratulationsModal } from '../SpaceСongratulationsModal'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import { TextAreaLengthCounter } from '../../../../shared/TextAreaLengthCounter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faTrashCan } from '@fortawesome/pro-light-svg-icons';

const keyMap = {
  CREATE: ['meta+enter', 'meta+s'],
  CANCEL: ['escape'],
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
      isCentered
      size={'2xl'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display='flex' alignItems='center' justifyContent='space-between'>
          {store.existedSpace ? 'Edit' : 'Create'} space
          {store.existedSpace && store.existedSpace.type !== 'personal' &&
            <IconButton
              aria-label='delete'
              variant='ghost'
              onClick={store.openConfirmationDelete}
              colorScheme='red'
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </IconButton>}
        </ModalHeader>
        <ModalBody pb={6} position='relative'>
          <Container maxW='2xl'>
            <VStack>
              <HStack
                overflow='visible'
                w='100%'
                spacing={0}
                marginBottom={4}
              >
                <SpaceCreationEmojiSelect />
                <Box flex={1}>
                  <Input
                    size='lg'
                    value={store.name}
                    autoFocus
                    placeholder='Add a space name'
                    onChange={store.handleNameChange}
                    variant='flushed'
                  />
                </Box>
              </HStack>
              <HStack
                overflow='visible'
                w='100%'
                spacing={0}
                display='flex'
              >
                <Box flex={1}>
                  <Text fontSize='md' fontWeight='semibold' lineHeight={6}>
                    Description
                  </Text>
                  <Text fontSize='sm' fontWeight='normal' lineHeight={5} >
                    Write about the space so users know where you invite them
                  </Text>
                  <TextAreaLengthCounter textValue={store.description} limit={store.descriptionLimit}>
                    <Box
                      display='flex'
                      w='100%'>
                      <FontAwesomeIcon
                        icon={faAlignLeft}
                        color='#A0AEC0'
                        size='lg'
                        style={{ margin: '10px 11px 0 0' }} />
                      <Textarea
                        maxLength={store.descriptionLimit}
                        size='lg'
                        resize='none'
                        value={store.description}
                        placeholder='Add description'
                        onChange={store.handleDescriptionChange}
                        variant='unstyled'
                      />
                    </Box>
                  </TextAreaLengthCounter>
                </Box>
              </HStack>
            </VStack>
          </Container>
        </ModalBody>
        <ModalFooter display='flex' justifyContent='flex-end' gap={3} >
          <Button onClick={store.handleClose} display='flex' flexDirection='row'>
            Cancel
            <Text ml={1} fontSize='xs' color='blackAlpha.500'>
              Esc
            </Text>
          </Button>
          <Button
            colorScheme='blue'
            onClick={store.handleSave}
            isDisabled={!store.isReadyForSave}
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

      <SpaceСongratulationsModal
        onClose={store.handleClose}
        isOpen={store.isСongratulationsModal}
        onConnect={store.handelConnect} />

      <DeleteSpaceModal
        isOpen={store.isDeleteConfirmationOpen}
        onClose={store.closeDeleteConfirmation}
        onDelete={store.confirmDeletion}
      />

    </Modal >
  );
});
