import React from 'react';
import { observer } from 'mobx-react-lite';
import { TaskProps, TaskStoreProvider } from './store';
import { TaskView } from './view';

export const Task = observer(function Task(props: TaskProps) {
  return (
    <TaskStoreProvider {...props}>
      <TaskView />
    </TaskStoreProvider>
  );
});
