import React from 'react';
import { observer } from 'mobx-react-lite';
import { TaskItemProps, TaskItemStoreProvider } from './store';
import { TaskItemView } from './view';

const TaskItem = observer(function TaskItem(props: TaskItemProps) {
  return (
    <TaskItemStoreProvider {...props}>
      <TaskItemView/>
    </TaskItemStoreProvider>
  );
});

export default TaskItem;