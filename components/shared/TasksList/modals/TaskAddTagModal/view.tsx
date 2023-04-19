import { observer } from 'mobx-react-lite';
import React, { useRef } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  chakra,
  Box,
  Button,
  Text,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import {
  useTaskAddTagModalStore,
} from './store';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import { useOutsideClick } from '@chakra-ui/react-use-outside-click'
import { TactTaskTag } from '../../../TactTaskTag';
import { isMac } from '../../../../../helpers/os';


export const TaskAddTagModalView = observer(function TaskAddTagModalView() {
  const store = useTaskAddTagModalStore();
  const ref = useRef(null);

  useHotkeysHandler(store.keyMap, store.hotkeyHandlers)

  useOutsideClick({
    enabled: store.showSuggestions,
    ref: ref,
    handler: store.toggleSuggestion,
  });

  return (
    <Modal isCentered isOpen={true} onClose={store.callbacks.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add hashtag</ModalHeader>
        <ModalBody pb={6} pl={5} pr={5}>
          <Text fontSize='xs' fontWeight='semibold' mb={2} lineHeight={4}>
            Hashtags of the current task
          </Text>
          <HStack
            w='100%'
            flexWrap='wrap'
            align='center'
            gap={2}
            p={2}
            border='2px solid #4299E1'
            borderRadius={2}
            css={{
              '& > button, > div': {
                'margin-inline-start': '0px!important',
              }
            }}
          >
            {store.selectedTags?.map(({ title, id }) => (
              <TactTaskTag
                title={title}
                showRemoveIcon
                key={id}
                buttonProps={{
                  mr: 0,
                  onKeyDown: (e) => {
                    e.stopPropagation();
                    if (e.code === 'Backspace') {
                      store.removeTag(id)
                    }
                  }
                }}
                iconButtonProps={{
                  onClick: (e) => {
                    e.stopPropagation();
                    store.removeTag(id);
                  },
                }}
              />
            ))}

            <InputGroup
              w='unset'
            >
              {store.showSuggestions && (
                <Popover
                  isOpen={store.showSuggestions}
                  placement={'bottom-start'}
                  offset={[30, 8]}
                  isLazy
                  autoFocus={false}
                >
                  <PopoverTrigger><chakra.span /></PopoverTrigger>
                  <Portal>
                    <PopoverContent
                      onClick={(e) => e.stopPropagation()}
                      p={0}
                      boxShadow='lg'
                      minW={32}
                      maxW={72}
                      width='auto'
                      overflow='hidden'
                    >
                      <PopoverBody
                        p={0}
                        maxH={64}
                        overflow='auto'
                        ref={ref}
                      >
                        {store.suggestions.map((child, index) => (
                          <Button
                            variant='ghost'
                            size='sm'
                            borderRadius={0}
                            w='100%'
                            key={index}
                            height='auto'
                            minH={8}
                            fontSize='sm'
                            fontWeight='normal'
                            display='flex'
                            justifyContent='start'
                            onClick={() => store.suggestionsMenu.onSelect(index)}
                            bg={
                              store.suggestionsMenu.hoveredIndex === index
                                ? 'gray.100'
                                : 'white'
                            }
                            ref={
                              store.suggestionsMenu.hoveredIndex === index
                                ? (el) => store.suggestionsMenu.setRef(el)
                                : undefined
                            }
                            _focus={{
                              outline: 'none',
                              boxShadow: 'none',
                            }}
                          >
                            {child}
                          </Button>
                        ))}
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              )}
              <InputLeftElement maxH='100%' color='gray.500' fontWeight='300' fontSize='1.2em'>#</InputLeftElement>
              <Input
                placeholder='Type in a tag'
                flexGrow={1}
                maxLength={20}
                onKeyDown={store.inputKeyDown}
                onChange={store.handleInputChange}
                onFocus={store.handleFocusMenu}
                variant="unstyled"
              />
            </InputGroup>
          </HStack>
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
                return (
                  <TactTaskTag
                    title={title}
                    key={id}
                    selected={alreadySelected}
                    buttonProps={{
                      mb: 2.5,
                      mr: 2,
                      onClick: () => alreadySelected ? store.removeTag(id) : store.addTag({ title, id })
                    }}
                  />
                )
              })}
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
              {`${isMac() ? '⌘' : 'Ctrl'} + Enter`}
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
