import { observer } from 'mobx-react-lite';
import Picker from '@emoji-mart/react';
import { colors, useGoalCreationModalStore } from '../store';
import {
  Box,
  Button, HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal, Text,
  useDisclosure
} from '@chakra-ui/react';

export const GoalCreationEmojiSelect = observer(function GoalCreationEmojiSelect() {
  const store = useGoalCreationModalStore();
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} isLazy>
      <PopoverTrigger>
        <Button
          variant='filled'
          bg={store.color}
          borderRadius='full'
          size='lg'
          p={0}
          mr={4}
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          <Text fontSize={'3xl'}>{store.icon}</Text>
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w='auto'>
          <PopoverBody p={0}>
            <Box display='flex' justifyContent='center'>
              <HStack p={2}>
                {
                  colors.map((color) => (
                    <Button
                      onClick={() => store.handleColorSelect(color)}
                      key={color}
                      borderColor={color === store.color ? color.replace(/\d+/, '400') : 'transparent'}
                      borderWidth={4}
                      variant='filled'
                      bg={color}
                      borderRadius='full'
                      size='sm'
                      p={0}
                    />
                  ))
                }
              </HStack>
            </Box>
            <Picker autoFocus theme='light' data={async () => {
              const module = await import('@emoji-mart/data');

              return module.default;
            }} onEmojiSelect={store.handleEmojiSelect}/>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
});
