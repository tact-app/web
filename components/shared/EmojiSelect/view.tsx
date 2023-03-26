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
  useOutsideClick,
} from '@chakra-ui/react';
import { useEmojiSelectStore } from './store';
import { EmojiStore } from '../../../stores/EmojiStore';
import { EmojiSelectViewProps } from './types';
import { EMOJI_SELECT_COLORS } from './constants';
import React, { useRef } from "react";

export const EmojiSelectComponent = observer(
  function EmojiSelectComponent({
    size = 8,
    iconFontSize = 'xl',
    borderRadius = 'full',
    canRemoveEmoji,
  }: EmojiSelectViewProps) {
    const store = useEmojiSelectStore();

    const ref = useRef();

    useOutsideClick({
      ref,
      handler: store.closeEmojiPicker,
    });

    const focusedTriggerBoxShadow = `inset 0px 0px 0px 2px var(--chakra-colors-${
      store.mainColor.color
    }-${
      store.mainColor.modifier + 100
    })`;

    return (
      <Popover
        isOpen={store.isEmojiPickerOpen}
        onOpen={store.openEmojiPicker}
        onClose={store.closeEmojiPicker}
        closeOnEsc={false}
        isLazy
      >
        <PopoverTrigger>
          <Button
            variant='filled'
            bg={store.color}
            color={store.mainColor.color + '.500'}
            borderRadius={borderRadius}
            boxShadow={store.isEmojiPickerOpen && focusedTriggerBoxShadow}
            p={0}
            w={size}
            h={size}
            minW='auto'
            display='flex'
            justifyContent='center'
            alignItems='center'
            _focus={{ boxShadow: focusedTriggerBoxShadow }}
          >
            <Text fontSize={iconFontSize}>{store.triggerContent}</Text>
          </Button>
        </PopoverTrigger>
        <PopoverContent w='auto' ref={ref}>
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
      </Popover>
    );
  }
);
