import { observer } from 'mobx-react-lite';
import React from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import {
  Box,
  Button,
  Text,
} from '@chakra-ui/react';
import {
  useTaskAddTagModalStore,
} from './store';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import { TagsInput } from '../../../TagsInput';
import { TactTaskTag } from '../../../TactTaskTag';


export const TaskAddTagModalView = observer(function TaskAddTagModalView() {
  const store = useTaskAddTagModalStore();

  useHotkeysHandler(store.keyMap, store.hotkeyHandlers)

  return (
    <Modal isCentered isOpen={true} onClose={store.callbacks.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add hashtag</ModalHeader>
        <ModalBody pb={6} pl={5} pr={5}>
          <Text fontSize='xs' fontWeight='semibold' mb={2} lineHeight={4}>
            Hashtags of the current task
          </Text>
          <TagsInput
            tags={store.selectedTags}
            addTag={store.createNewTag}
            removeTag={store.removeTag}
          />
          {!!store.availableTags.length && (<Box flex={1}>
            <Text fontSize='xs' fontWeight='semibold' mt={4} lineHeight={4}>
              All your hashtags
            </Text>
            <Box
              mt={1}
              pt={1}
              overflowY='scroll'
              maxHeight='98px'
              flexWrap='wrap'
              display='flex'
              alignItems='center'
              flexDirection='row'
              css={{
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              {store.availableTags.map(({ title, id }) => {
                const alreadySelected = !!store.selectedTags.find(({ id: selectedId }) => selectedId === id)
                return(
                <TactTaskTag
                  title={title}
                  key={id}
                  buttonProps={{
                    mb: 2.5,
                    mr: 2,
                    onClick: () => alreadySelected ? store.removeTag(id) : store.addTag({ title, id })
                  }}
                  tagProps={{
                    bg: alreadySelected ? 'blue.600' : 'blue.400'
                  }}
                />
              )})}
            </Box>
          </Box>)}
        </ModalBody>

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
            onClick={store.handleSave}
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
              ⌘ + Enter
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
