import { FC } from 'react'
import Picker from '@emoji-mart/react';
import { Box, Button } from '@chakra-ui/react';

interface RemovableEmojiSelectProps {
    onRemove: () => void;
    pickedIcon: string;
}

export const RemovableEmojiSelect: FC<RemovableEmojiSelectProps & any> = ({ onRemove, pickedIcon, ...props }) => (
    <Box position='relative'>
        <Picker {...props} />
        {pickedIcon && <Button
            right='16px'
            bottom='20px'
            position='absolute'
            size='xs'
            colorScheme='gray'
            onClick={onRemove}
            zIndex='2'>
            Remove
        </Button>}
    </Box>
);
