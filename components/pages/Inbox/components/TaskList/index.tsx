import { observer } from 'mobx-react-lite';
import { useTasksStore } from '../../store';
import TaskItem from '../TaskItem';
import { DndItem, DndList } from '../../../../shared/DndList';
import { Container, Heading } from '@chakra-ui/react';
import { TaskInput } from '../TaskInput';
import React from 'react';

const TaskList = observer(function TaskList() {
  const store = useTasksStore();

  return (
    <Container maxW='container.lg'>
      <Heading size='lg' mt={2.5} mb={8} pt={4}>Today</Heading>
      <TaskInput onCreate={store.createTask}/>
      <DndList onMove={store.onOrderChange}>
        {store.items.map((task, index) => (
          <DndItem key={task.id} item={task} index={index} mb={4} ml={4} mr={4}>
            <TaskItem item={task}/>
          </DndItem>
        ))}
      </DndList>
    </Container>
  );
});

export default TaskList;