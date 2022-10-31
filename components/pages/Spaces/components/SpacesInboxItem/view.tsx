import { observer } from 'mobx-react-lite';
import { SpacesInboxItemProps, useSpacesInboxItemStore } from './store';
import { Box, Heading, Text } from '@chakra-ui/react';
import { HorizontalCollapse } from '../../../../shared/HorizontalCollapse';

export const SpacesInboxItemView = observer(function SpacesInboxItemView(
  props: SpacesInboxItemProps
) {
  const store = useSpacesInboxItemStore();

  return (
    <HorizontalCollapse flex={!!store.item ? 1 : 0} isOpen={!!store.item}>
      {store.item && (
        <Box p={7} boxShadow='lg' flex={1} h='100%'>
          <Heading fontSize='2xl' fontWeight='semibold'>
            {store.item.title}
          </Heading>
          <Box mt={6}>
            <Text>{store.description}</Text>
          </Box>
        </Box>
      )}
    </HorizontalCollapse>
  );
});
