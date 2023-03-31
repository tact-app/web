import {
  TooltipProps as ChakraTooltipProps,
  Tooltip as ChakraTooltip,
  Text,
  Box
} from '@chakra-ui/react';

type TooltipProps = ChakraTooltipProps & {
  hotkey?: string;
};

export function Tooltip({ hotkey, label, children, ...additionalProps }: TooltipProps) {
  return (
    <ChakraTooltip
      hasArrow
      label={
        <Box display='flex' alignItems='center' flexDirection='column'>
          {label}
          {hotkey && (
            <Text color='gray.400' lineHeight={4}>
              {hotkey}
            </Text>
          )}
        </Box>
      }
      bg='gray.700'
      color='white'
      fontSize='xs'
      pt={0.5}
      pb={0.5}
      pl={4}
      pr={4}
      borderRadius={4}
      arrowSize={6}
      lineHeight={4}
      {...additionalProps}
    >
      {children}
    </ChakraTooltip>
  )
}
