import { Text } from '@chakra-ui/react';
import React from 'react';

type Props = {
  hotkey: string;
};

export function ButtonHotkey({ hotkey }: Props) {
  return (
    <Text
      fontSize='xs'
      lineHeight={4}
      fontWeight='normal'
      ml={1}
    >
      {hotkey}
    </Text>
  );
}
