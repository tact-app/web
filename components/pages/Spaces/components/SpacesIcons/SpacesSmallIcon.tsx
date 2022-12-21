import { observer } from 'mobx-react-lite';
import { chakra } from '@chakra-ui/react';
import { SpaceData } from '../../types';

export const SpacesSmallIcon = observer(function SpacesSmallIcon({
  space,
  size = 8,
}: {
  space: SpaceData;
  size?: number;
}) {
  return space ? (
    <chakra.div
      borderRadius='full'
      display='flex'
      justifyContent='center'
      alignItems='center'
      w={size}
      minW={size}
      h={size}
      fontWeight={600}
      bg={space.color + '.200'}
      fontSize={size > 6 ? 'lg' : 'sm'}
      color={space.color + '.500'}
    >
      {space.shortName}
    </chakra.div>
  ) : null;
});
