import { observer } from 'mobx-react-lite';
import { SpacesInboxProps, useSpacesInboxStore } from './store';
import { Box } from '@chakra-ui/react';

export const SpacesInboxView = observer(function SpacesInboxView(props: SpacesInboxProps) {
  const store = useSpacesInboxStore();

  return (
    <Box></Box>
  );
});
