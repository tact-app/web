import { observer } from 'mobx-react-lite';
import Picker from '@emoji-mart/react';
import {
  Box,
  Button,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { useEmojiSelectStore } from './store';
import { EmojiStore } from '../../../stores/EmojiStore';
import { EmojiSelectViewProps } from './types';
import { EMOJI_SELECT_COLORS } from './constants';
import React, { forwardRef } from "react";
import { useRefWithCallback } from '../../../helpers/useRefWithCallback';

export const EmojiSelectView = observer(
    forwardRef<HTMLButtonElement, EmojiSelectViewProps>(
        function EmojiSelectView(
          {
            size = 8,
            iconFontSize = 'xl',
            borderRadius = 'full',
            canRemoveEmoji,
            cursor,
            tabIndex,
          },
          triggerRef
        ) {
          const store = useEmojiSelectStore();

          const ref = useRefWithCallback<HTMLButtonElement>(triggerRef, store.setRef)

          const { isOpen, onClose, onOpen } = useDisclosure({
            isOpen: store.isEmojiPickerOpen,
            onClose: store.closeEmojiPicker,
            onOpen: store.openEmojiPicker,
          });

          const focusedTriggerBoxShadow = `inset 0px 0px 0px 2px var(--chakra-colors-${
              store.mainColor.color
          }-${
              store.mainColor.modifier + 100
          })`;

          return (
            <div onFocus={store.preventPropagation} onKeyDown={store.handleContainerKeyDown}>
              <Popover
                  isOpen={isOpen}
                  onOpen={onOpen}
                  onClose={onClose}
                  closeOnEsc={false}
                  returnFocusOnClose={false}
                  isLazy
                  modifiers={[
                    {
                      name: 'preventOverflow',
                      options: {
                        tether: false,
                        altAxis: true,
                        padding: 8,
                        boundary: 'clippingParents',
                        rootBoundary: 'viewport'
                      }
                    }
                  ]}
              >
                <PopoverTrigger>
                  <Button
                      ref={ref}
                      variant='filled'
                      bg={store.color}
                      color={store.mainColor.color + '.500'}
                      borderRadius={borderRadius}
                      boxShadow={store.isEmojiPickerOpen && !store.disabled && focusedTriggerBoxShadow}
                      p={0}
                      w={size}
                      h={size}
                      minW='auto'
                      display='flex'
                      justifyContent='center'
                      alignItems='center'
                      tabIndex={tabIndex}
                      cursor={cursor ?? (store.disabled ? 'default' : 'pointer')}
                      _focus={{ boxShadow: !store.disabled && focusedTriggerBoxShadow }}
                      onFocus={store.callbacks?.onFocus}
                      onBlur={store.callbacks?.onBlur}
                      onKeyDown={store.handleKeyDown}
                      onClick={(e) => !store.disabled && store.preventPropagation(e)}
                  >
                    <Text fontSize={iconFontSize}>{store.triggerContent}</Text>
                  </Button>
                </PopoverTrigger>
                <Portal>
                  <PopoverContent w='auto' onClick={store.preventPropagation}>
                    <PopoverBody p={0}>
                      <Box display='flex' justifyContent='center'>
                        <HStack p={2}>
                          {EMOJI_SELECT_COLORS.map((color) => (
                              <Button
                                  onClick={() => store.handleColorSelect(color)}
                                  key={color}
                                  borderColor={
                                    color === store.color
                                        ? `${store.mainColor.color}.400`
                                        : 'transparent'
                                  }
                                  borderWidth={4}
                                  variant='filled'
                                  bg={color}
                                  borderRadius='full'
                                  size='sm'
                                  p={0}
                              />
                          ))}
                        </HStack>
                      </Box>
                      <Box position='relative'>
                        <Picker
                            autoFocus
                            theme='light'
                            data={EmojiStore.emojiData}
                            onEmojiSelect={store.handleEmojiSelect}
                        />
                        {canRemoveEmoji && store.icon && (
                            <Button
                                right='16px'
                                bottom='20px'
                                position='absolute'
                                size='xs'
                                colorScheme='gray'
                                onClick={store.handleEmojiRemove}
                                zIndex='2'
                            >
                              Remove
                            </Button>
                        )}
                      </Box>
                    </PopoverBody>
                  </PopoverContent>
                </Portal>
              </Popover>
            </div>
          );
        }
    )
);
