import { Box, Text } from '@chakra-ui/react';
import { GoalIconData, GoalIconVariants } from '../../pages/Goals/types';
import React from 'react';
import { observer } from 'mobx-react-lite';

export const GoalIcon = observer(function GoalIcon({
  icon,
  size = 8,
  fontSize = 'lg',
}: {
  icon: GoalIconData;
  size?: number;
  fontSize?: string;
}) {
  return (
    <Box
      w={size}
      h={size}
      borderRadius='full'
      display='inline-flex'
      justifyContent='center'
      flexDirection='column'
      bg={icon.color}
    >
      {icon && icon.type === GoalIconVariants.EMOJI ? (
        <Text fontSize={fontSize} textAlign='center'>
          {icon.value}
        </Text>
      ) : null}
    </Box>
  );
});
