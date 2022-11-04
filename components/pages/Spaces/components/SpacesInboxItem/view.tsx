import { observer } from 'mobx-react-lite';
import { SpacesInboxItemProps, useSpacesInboxItemStore } from './store';
import { Box, Container, Divider, Heading, Text } from '@chakra-ui/react';
import TasksList from '../../../../shared/TasksList';
import { ItemToolbar } from '../../../../shared/ItemToolbar/itemToolbar';

export const SpacesInboxItemView = observer(function SpacesInboxItemView(
  props: SpacesInboxItemProps
) {
  const store = useSpacesInboxItemStore();

  return (
    <Container
      p={7}
      overflow='auto'
      h='100%'
      maxW='container.md'
      onMouseDown={store.callbacks.onFocus}
    >
      <ItemToolbar
        onExpand={store.callbacks.onExpand}
        onCollapse={store.callbacks.onCollapse}
        onPreviousItem={store.callbacks.onPreviousItem}
        onNextItem={store.callbacks.onNextItem}
        onClose={store.callbacks.onClose}
      />
      <Box mt={6}>
        <Heading fontSize='2xl' fontWeight='semibold'>
          {store.item.title}
        </Heading>
        <Box mt={6}>
          <Text>{store.description}</Text>
        </Box>
        <Divider mt={6} mb={8} />
        <TasksList
          instance={store.list}
          input={store.item}
          isHotkeysEnabled={store.isHotkeysEnabled}
          callbacks={{
            onFocusLeave: props.callbacks.onFocusLeave,
            onOpenTask: props.callbacks.onOpenTask,
            onCloseTask: props.callbacks.onCloseTask,
          }}
        />
      </Box>
    </Container>
  );
});
