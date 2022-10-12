import { observer } from 'mobx-react-lite';
import { useTasksStore } from '../../store';
import { Container, Heading, Box } from '@chakra-ui/react';
import { TaskCreator } from '../TaskCreator';
import React from 'react';
import { TaskListItem } from '../TaskListItem';
import { ModalsSwitcher } from '../../../../../helpers/ModalsController';
import { DraggableList } from '../../../../shared/DraggableList';
import { GlobalHotKeys } from 'react-hotkeys';

const keyMap = {
  DONE: 'd',
  WONT_DO: ['w', 'cmd+w'],
  EDIT: 'space',
  OPEN: 'enter',
};

const TaskList = observer(function TaskList() {
  const store = useTasksStore();

  return (
    <Container maxW='container.lg' p={0}>
      <Box pl={5} pr={5}>
        <Heading size='lg' mt={2.5} mb={8} pt={4}>Today</Heading>
        <TaskCreator
          onCreate={store.createTask}
          onTagCreate={store.createTag}
          onNavigate={store.draggableList.handleNavigation}
          tagsMap={store.tagsMap}
          listId={store.listId}
          keepFocus
        />
      </Box>
      <GlobalHotKeys
        keyMap={keyMap}
        handlers={store.hotkeyHandlers}
      >
        <DraggableList
          items={store.order}
          content={TaskListItem}
          callbacks={store.draggableHandlers}
                       instance={store.draggableList}
        />
      </GlobalHotKeys>
      <ModalsSwitcher controller={store.modals}/>
    </Container>
  );
});

export default TaskList;