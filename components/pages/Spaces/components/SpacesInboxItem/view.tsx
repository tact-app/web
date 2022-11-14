import { observer } from 'mobx-react-lite';
import { SpacesInboxItemProps, useSpacesInboxItemStore } from './store';
import { Box, Container, Divider, Heading, Text } from '@chakra-ui/react';
import TasksList from '../../../../shared/TasksList';
import { ItemToolbar } from '../../../../shared/ItemToolbar/itemToolbar';
import { SpacesInboxItemFields } from './SpacesInboxItemFields';

export const SpacesInboxItemView = observer(function SpacesInboxItemView(
  props: SpacesInboxItemProps
) {
  const store = useSpacesInboxItemStore();

  return (
    <Container
      p={6}
      overflow='auto'
      h='100%'
      maxW='container.md'
      display='flex'
      flexDirection='column'
      onMouseDown={store.callbacks.onFocus}
    >
      <ItemToolbar
        ml={1}
        mr={1}
        onExpand={store.callbacks.onExpand}
        onCollapse={store.callbacks.onCollapse}
        onPreviousItem={store.callbacks.onPreviousItem}
        onNextItem={store.callbacks.onNextItem}
        onClose={store.callbacks.onClose}
        isExpanded={props.isExpanded}
      />
      <Box mt={6} display='flex' flexDirection='column' overflow='hidden'>
        <Heading fontSize='2xl' fontWeight='semibold' mr={1} ml={1} mb={6}>
          {store.item.title}
        </Heading>
        <Box overflow='auto' pr={1} pl={1}>
          <SpacesInboxItemFields />
          <Box>
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
      </Box>
    </Container>
  );
});
