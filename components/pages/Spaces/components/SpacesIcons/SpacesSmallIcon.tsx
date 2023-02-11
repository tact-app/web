import { observer } from 'mobx-react-lite';
import { chakra } from '@chakra-ui/react';
import { SpaceData } from '../../types';

export const SpacesSmallIcon = observer(function SpacesSmallIcon({
  space,
  size = 8,
  borderRadius = 'full',
  bgOpacity = '.200',
}: {
  space: SpaceData;
  size?: number;
  borderRadius?: string | number;
  bgOpacity?: string;
}) {
  return space ? (
    <chakra.div
      borderRadius={borderRadius}
      display='flex'
      justifyContent='center'
      alignItems='center'
      w={size}
      minW={size}
      h={size}
      fontWeight={600}
      bg={space.color + bgOpacity}
      fontSize={size > 6 ? 'lg' : 'sm'}
      color={space.color + '.500'}
    >
      {space.icon || space.name[0]}
    </chakra.div>
  ) : null;
});
