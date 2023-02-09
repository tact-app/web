import React, { FC } from 'react'
import { VStack, Text, Button, HStack, Tag } from '@chakra-ui/react';
import { OriginIcon } from '../../../components/SpacesIcons/OriginsIcons';
import { AppProps } from './ConnectionApps';
import { ConnectItemMenu } from './ConnectItemMenu';

enum BUTTON_TEXT {
    CONNECT = "Connect",
    CONNECTED = "Connected",
    DISCONNECT = "Disconnect",
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
}) => (
    <VStack alignItems='start' role="group">
        <HStack justifyContent='space-between' alignItems='center' w='100%'>
            <OriginIcon origin={iconType} size='24px' />
            <ConnectItemMenu isConnected={isConnected} onConnect={onConnect}/>
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
            variant='link'
            onClick={onConnect}
            _hover={{
                '&:before': {
                    ...(isConnected && {
                        content: `'${BUTTON_TEXT.DISCONNECT}'`,
                        color: '#E53E3E'
                    }),
                    textDecoration: 'underline'
                }
            }}
            css={{
                '&:before': {
                    content: `'${isConnected ? BUTTON_TEXT.CONNECTED : BUTTON_TEXT.CONNECT}'`,
                    color: isConnected ? '#A0AEC0' : '#3182ce'
                }
            }} />
    </VStack>
);
