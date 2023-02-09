import {FC} from 'react';
import {
    Portal,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    IconButton,
    Button,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/pro-regular-svg-icons';

interface ConnectItemMenuProps{
    isConnected?: boolean;
    onConnect: () => void;
}

export const ConnectItemMenu: FC<ConnectItemMenuProps> = ({isConnected, onConnect}) => {
    return (
        <Popover
            isLazy>
            <PopoverTrigger>
                <IconButton
                    bg='transparent'
                    aria-label='menu'
                    _groupHover={{
                        visibility: 'visible',
                    }}
                    visibility='hidden'
                    >
                    <FontAwesomeIcon
                        icon={faEllipsis}
                        size='lg'
                        color='#718096' />
                </IconButton>
            </PopoverTrigger>
            <Portal>
                <PopoverContent w='auto'>
                    <PopoverBody p={0}>
                        <Button onClick={onConnect} variant='ghost' colorScheme='blue' size='sm'>
                            {isConnected ? 'Disconnect' : 'Connect'}
                        </Button>
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover>
    )
}
