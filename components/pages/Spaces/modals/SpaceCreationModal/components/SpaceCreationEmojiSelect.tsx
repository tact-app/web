import React from 'react'
import { observer } from 'mobx-react-lite';
import {
    Box,
    Button,
    HStack,
    Portal,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
} from '@chakra-ui/react';
import { useSpaceCreationModalStore } from '../store';
import { colors } from '../../../constants';
import { RemovableEmojiSelect } from '../../../../../shared/RemovableEmojiSelect';

export const SpaceCreationEmojiSelect = observer(
    function SpaceCreationEmojiSelect() {
        const store = useSpaceCreationModalStore();

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
                        bg={store.color + '.200'}
                        size='sm'
                        maxW='32px'
                        mr={2}
                        color={store.color + '.500'}
                    >
                        <Text fontSize={'sm'}>{store.icon || store.name?.[0]}</Text>
                    </Button>
                </PopoverTrigger>
                <Portal>
                    <PopoverContent w='auto'>
                        <PopoverBody p={0}>
                            <Box display='flex' justifyContent='center'>
                                <HStack p={2}>
                                    {colors.map((color) => (
                                        <Button
                                            onClick={() => store.handleColorSelect(color)}
                                            key={color}
                                            borderColor={
                                                color === store.color
                                                    ? color + '.400'
                                                    : 'transparent'
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
                            <RemovableEmojiSelect
                                onRemove={store.handleRemoveEmoji}
                                pickedIcon={store.icon}
                                autoFocus
                                theme='light'
                                onEmojiSelect={store.handleEmojiSelect}
                            />
                        </PopoverBody>
                    </PopoverContent>
                </Portal>
            </Popover>
        );
    })
