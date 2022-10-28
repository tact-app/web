import { observer } from 'mobx-react-lite';
import { SpacesProps, useSpacesStore } from './store';
import { Box } from '@chakra-ui/react';
import { SpacesMenu } from './components/SpacesMenu';

export const SpacesView = observer(function SpacesView(props: SpacesProps) {
  const store = useSpacesStore();

  return (
    <Box h='100%'>
      <SpacesMenu />
    </Box>
  );
});
