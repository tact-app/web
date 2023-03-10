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
} from '@chakra-ui/react';
import { EMOJI_SELECT_COLORS, EmojiSelectProps, useEmojiSelectStore } from "./store";
import { EmojiStore } from "../../../stores/EmojiStore";

export const EmojiSelectComponent = observer(
  function EmojiSelectComponent({
    size = 8,
    iconFontSize = 'xl'
  }: Pick<EmojiSelectProps, 'iconFontSize' | 'size'>) {
    const store = useEmojiSelectStore();

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
            borderRadius='full'
            p={0}
            w={size}
            h={size}
            minW='auto'
            display='flex'
            justifyContent='center'
            alignItems='center'
          >
            <Text fontSize={iconFontSize}>{store.icon}</Text>
          </Button>
        </PopoverTrigger>
        <PopoverContent w='auto'>
          <PopoverBody p={0}>
            <Box display='flex' justifyContent='center'>
              <HStack p={2}>
                {EMOJI_SELECT_COLORS.map((color) => (
                  <Button
                    onClick={() => store.handleColorSelect(color)}
                    key={color}
                    borderColor={
                      color === store.color
                        ? color.replace(/\d+/, '400')
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
            <Picker
              autoFocus
              theme='light'
              data={EmojiStore.emojiData}
              onEmojiSelect={store.handleEmojiSelect}
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }
);
