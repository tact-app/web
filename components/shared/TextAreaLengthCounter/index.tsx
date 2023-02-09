import React, { FC, ReactNode } from 'react'
import {
    VStack,
    Text,
} from '@chakra-ui/react';

interface CounterProps {
    textValue: string;
    limit: number;
    children: ReactNode;
}

export const TextAreaLengthCounter: FC<CounterProps> = ({
    textValue,
    limit,
    children
}) => (
    <VStack>
        {children}
        <Text fontSize='xs' fontWeight='normal' alignSelf='end' lineHeight={4} color='gray.400'>
            {textValue?.length ?? 0}/{limit}
        </Text>
    </VStack>
)
