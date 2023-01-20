import { observer } from 'mobx-react-lite';
import { Text, TextProps } from '@chakra-ui/react';
import { useMemo } from 'react';
import { isMac } from '../../../helpers/os';

const macDict = {
  meta: '⌘',
  shift: '⇧',
  alt: '⌥',
  options: '⌥',
  ctrl: '⌃',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

const winDict = {
  shift: '⇧',
  alt: 'Alt',
  ctrl: 'Ctrl',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

export const HotkeyBlock = observer(function HotkeyBlock({
  hotkey,
  ...rest
}: {
  hotkey: string;
} & TextProps) {
  const hotkeyText = useMemo(() => {
    if (hotkey === 'Enter') {
      return 'Enter';
    }

    return hotkey
      .split('+')
      .map((key) => (isMac() ? macDict[key.toLowerCase()] : winDict[key.toLowerCase()] || key))
      .join(isMac() ? '' : '+');
  }, [hotkey]);

  return (
    <Text
      fontSize='md'
      fontWeight='normal'
      color='gray.400'
      bg='gray.100'
      borderRadius='base'
      ml={3}
      pr={1}
      pl={1}
      {...rest}
    >
      {hotkeyText}
    </Text>
  );
});
