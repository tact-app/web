import { observer } from 'mobx-react-lite';
import { SpacesInboxItemProps, useSpacesInboxItemStore } from './store';
import { Box, Container, Divider, Heading, Text } from '@chakra-ui/react';
import { ItemToolbar } from '../../../../shared/ItemToolbar/itemToolbar';
import { SpacesInboxItemFields } from './SpacesInboxItemFields';
import { TasksListWithCreator } from '../../../../shared/TasksListWithCreator';
import { DraggableListContext } from '../../../../shared/DraggableList/view';

export const SpacesInboxItemView = observer(function SpacesInboxItemView(
  props: SpacesInboxItemProps
) {
  const store = useSpacesInboxItemStore();

  return (
    <Container
      tabIndex={0}
      onKeyDown={store.handleContainerKeyDown}
      p={6}
      pb={0}
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
        isExpanded={store.isExpanded}
      />
      <Box mt={6} display='flex' flexDirection='column' overflow='hidden' h='100%'>
        <Heading fontSize='2xl' fontWeight='semibold' mr={1} ml={1} mb={6}>
          {store.item.title}
        </Heading>
        <Box overflowY='auto' overflowX='hidden' pr={1} pl={1} pb={3} h='100%'>
          <SpacesInboxItemFields />
          <Box>
            <Text>{store.description}</Text>
          </Box>
          <Divider mt={6} mb={8} />

          <DraggableListContext
            onDragStart={store.listWithCreator.list.draggableList.startDragging}
            onDragEnd={store.listWithCreator.list.draggableList.endDragging}
            sensors={store.listWithCreator.list.draggableList.sensors}
          >
            <TasksListWithCreator
              defaultSave
              instance={store.listWithCreator}
              listId={store.item.id}
              input={store.item}
              isHotkeysEnabled={store.isHotkeysEnabled}
              tasksListCallbacks={store.tasksListCallbacks}
              taskCreatorCallbacks={store.taskCreatorCallbacks}
              dnd={false}
            />
          </DraggableListContext>
        </Box>
      </Box>
    </Container>
  );
});
