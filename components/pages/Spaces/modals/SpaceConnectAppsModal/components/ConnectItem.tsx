import React, { FC, useState, useMemo } from 'react'
import { VStack, Text, Button, HStack, Tag, IconButton } from '@chakra-ui/react';
import { OriginIcon } from '../../../components/SpacesIcons/OriginsIcons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/pro-regular-svg-icons';
import { AppProps } from './ConnectionApps';

enum BUTTON_TEXT {
    CONNECT = 'Connect',
    CONNECTED = 'Connected',
    DISCONNECT = 'Disconnect',
}

interface ConnectItemProps extends AppProps {
    onConnect: () => void;
}

export const ConnectItem: FC<ConnectItemProps> = ({
    iconType,
    name,
    description,
    isNew,
    isConnected,
    onConnect
}) => {

    const [buttonText, setButtonText] = useState(isConnected ? BUTTON_TEXT.CONNECTED : BUTTON_TEXT.CONNECT)

    const textColor = useMemo(() => {
        if (buttonText === BUTTON_TEXT.DISCONNECT) {
            return 'red'
        }
        if (buttonText === BUTTON_TEXT.CONNECTED) {
            return 'black'
        }
        return 'blue'
    }, [buttonText])

    return (
        <VStack alignItems='start'>
            <HStack justifyContent='space-between' alignItems='center' w='100%'>
                <OriginIcon origin={iconType} size='24px' />
                <IconButton
                    bg='transparent'
                    aria-label='menu'>
                    <FontAwesomeIcon
                        icon={faEllipsis}
                        size='lg'
                        color='#718096' />
                </IconButton>
            </HStack>
            <HStack mt={2} alignItems='baseline'>
                <Text fontSize='md' lineHeight={6} fontWeight='semibold' >
                    {name}
                </Text>
                {isNew && <Tag ml={3} size='md' variant='solid' bg='blue.100' color='blue.500' >
                    New
                </Tag>}
            </HStack>
            <Text fontSize='sm' lineHeight={5} fontWeight='normal' >
                {description}
            </Text>
            <Button
                mt={4}
                fontSize='sm'
                lineHeight={5}
                fontWeight='semibold'
                colorScheme={textColor}
                variant='link'
                onClick={onConnect}
                onMouseEnter={() => {
                    isConnected && setButtonText(BUTTON_TEXT.DISCONNECT)
                }}
                onMouseLeave={() => {
                    isConnected && setButtonText(BUTTON_TEXT.CONNECTED)
                }}>
                {buttonText}
            </Button>
        </VStack>
    )
};
