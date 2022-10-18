import React from 'react';
import { observer } from 'mobx-react-lite';
import { TaskDescriptionStoreProvider } from './store';
import { TaskDescriptionView } from './view';
import { TaskData } from '../../store/types';
import { useTasksStore } from '../../store';

export const TaskDescription = observer(function TaskDescription({ task }: { task: TaskData }) {
  const tasksStore = useTasksStore()

  return (
    <TaskDescriptionStoreProvider task={task} close={tasksStore.closeTask}>
      <TaskDescriptionView/>
    </TaskDescriptionStoreProvider>
  );
});
