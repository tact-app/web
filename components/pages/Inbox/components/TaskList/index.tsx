import { observer } from 'mobx-react-lite';
import { useTasksStore } from '../../store';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Container, Heading, Box, useOutsideClick } from '@chakra-ui/react';
import { TaskInput } from '../TaskInput';
import React, { PropsWithChildren, useRef } from 'react';
import { TaskListItem } from '../TaskListItem';
import { GlobalHotKeys } from 'react-hotkeys';

const keyMap = {
  UP: 'up',
  DOWN: 'down',
  DONE: 'd',
  EDIT: 'space',
  MOVE_UP: ['j', 'cmd+up'],
  MOVE_DOWN: ['k', 'cmd+down'],
  SELECT_UP: ['shift+up'],
  SELECT_DOWN: ['shift+down'],
};

const TaskListWrapper = observer(function TaskListWrapper({ children }: PropsWithChildren) {
  const store = useTasksStore();

  return (
    <DragDropContext
      onDragStart={store.startDragging}
      onDragEnd={store.endDragging}
      sensors={[store.setDnDApi]}
    >
      <Droppable droppableId='droppable'>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});

const TaskList = observer(function TaskList() {
  const store = useTasksStore();
  const ref = useRef(null);

  useOutsideClick({
    ref: ref,
    handler: () => store.setFocusedTask(null),
  });

  return (
    <Container maxW='container.lg' p={0}>
      <Box pl={5} pr={5}>
        <Heading size='lg' mt={2.5} mb={8} pt={4}>Today</Heading>
        <TaskInput
          onCreate={store.createTask}
          onTagCreate={store.createTag}
          tags={store.tags}
          listId={store.listId}
          goToList={store.focusFirstTask}
        />
      </Box>
      <GlobalHotKeys
        keyMap={keyMap}
        handlers={store.hotkeyHandlers}
        tabIndex={-1}
      >
        <Box ref={ref}>
          <TaskListWrapper>
            {
              store.order.map((taskId, index) => {
                const task = store.items[taskId];

                return (
                  <Draggable draggableId={task.id} index={index} key={task.id}>
                    {(provided, snapshot) => (
                      <TaskListItem task={task} index={index} provided={provided} snapshot={snapshot}/>
                    )}
                  </Draggable>
                );
              })
            }
          </TaskListWrapper>
        </Box>
      </GlobalHotKeys>
    </Container>
  );
});

export default TaskList;