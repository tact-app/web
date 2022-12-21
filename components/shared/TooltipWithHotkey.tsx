import { observer } from 'mobx-react-lite';
import { Box, Text, Tooltip, TooltipProps } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export const TooltipWithHotkey = observer(function TooltipWithHotkey({
  children,
  label,
  hotkey,
  ...rest
}: PropsWithChildren<
  {
    label: string;
    hotkey: string;
  } & TooltipProps
>) {
  return (
    <Tooltip
      hasArrow
      label={
        <Box display='flex' alignItems='center' flexDirection='column'>
          {label}
          <Text fontSize='xs' color='gray.400'>
            {hotkey}
          </Text>
        </Box>
      }
      {...rest}
    >
      {children}
    </Tooltip>
  );
});
