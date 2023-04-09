import { Text, TextProps } from '@chakra-ui/react';
import React from 'react';

type Props = TextProps & {
  hotkey: string;
};

export function ButtonHotkey({ hotkey, ...otherProps }: Props) {
  return (
    <Text
      fontSize='xs'
      lineHeight={4}
      fontWeight='normal'
      ml={1}
      {...otherProps}
    >
      {hotkey}
    </Text>
  );
}
