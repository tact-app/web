import { observer } from 'mobx-react-lite';
import { useTasksStore } from '../../store';
import { Container, Heading, Box, HStack, IconButton } from '@chakra-ui/react';
import { TaskCreator } from '../TaskCreator';
import React from 'react';
import { TaskListItem } from '../TaskListItem';
import { ModalsSwitcher } from '../../../../../helpers/ModalsController';
import { DraggableList } from '../../../../shared/DraggableList';
import { FocusIcon } from '../../../../shared/Icons/FocusIcon';

const TaskList = observer(function TaskList() {
  const store = useTasksStore();

  return (
    <Container maxW='container.lg' p={0}>
      <Box pl={5} pr={5}>
        <HStack justifyContent='space-between'>
          <Heading size='lg' mt={2.5} mb={8} pt={4}>Today</Heading>
          <HStack>
            <IconButton aria-label='focus' variant='ghost' onClick={store.toggleFocusMode} stroke={store.isFocusActive ? 'blue.400' : 'gray.400'}>
              <FocusIcon/>
            </IconButton>
          </HStack>
        </HStack>
        <TaskCreator
          onCreate={store.createTask}
          onTagCreate={store.createTag}
          onNavigate={store.draggableList.handleNavigation}
          tagsMap={store.tagsMap}
          listId={store.listId}
          keepFocus
        />
      </Box>
      <DraggableList
        items={store.order}
        content={TaskListItem}
        callbacks={store.draggableHandlers}
        instance={store.draggableList}
      />
      <ModalsSwitcher controller={store.modals}/>
    </Container>
  );
});

export default TaskList;
