import { observer } from 'mobx-react-lite';
import { SpacesInboxItemProps, useSpacesInboxItemStore } from './store';
import { Box, Divider, Heading, Text } from '@chakra-ui/react';
import TasksList from '../../../../shared/TasksList';
import React from 'react';

export const SpacesInboxItemView = observer(function SpacesInboxItemView(
  props: SpacesInboxItemProps
) {
  const store = useSpacesInboxItemStore();

  return (
    <Box flex={1} p={7}>
      <Heading fontSize='2xl' fontWeight='semibold'>
        {store.item.title}
      </Heading>
      <Box mt={6}>
        <Text>{store.description}</Text>
      </Box>
      <Divider mt={6} mb={8} />
      <TasksList instance={store.list} input={store.item} />
    </Box>
  );
});
