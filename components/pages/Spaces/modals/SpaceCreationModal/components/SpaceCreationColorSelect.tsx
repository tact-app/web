import { observer } from 'mobx-react-lite';
import { colors, useSpaceCreationModalStore } from '../store';
import {
  Box,
  Button,
  chakra,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';

export const SpaceCreationColorSelect = observer(
  function SpaceCreationEmojiSelect() {
    const store = useSpaceCreationModalStore();

    return (
      <Popover
        isOpen={store.isColorPickerOpen}
        onOpen={store.openColorPicker}
        onClose={store.closeColorPicker}
        closeOnEsc={false}
        isLazy
      >
        <PopoverTrigger>
          <Button
            variant='filled'
            bg={store.color + '.200'}
            borderRadius='full'
            size='lg'
            p={0}
            mr={4}
            display='flex'
            justifyContent='center'
            alignItems='center'
          >
            <chakra.div
              fontSize='2xl'
              fontWeight={600}
              color={store.color + '.500'}
            >
              {store.shortName}
            </chakra.div>
          </Button>
        </PopoverTrigger>
        <PopoverContent w='auto'>
          <PopoverBody p={0}>
            <Box display='flex' justifyContent='center'>
              <HStack p={2}>
                {colors.map((color) => (
                  <Button
                    onClick={() => store.handleColorSelect(color)}
                    key={color}
                    borderColor={
                      color === store.color ? color + '.400' : 'transparent'
                    }
                    borderWidth={4}
                    variant='filled'
                    bg={color + '.200'}
                    borderRadius='full'
                    size='sm'
                    p={0}
                  />
                ))}
              </HStack>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }
);
