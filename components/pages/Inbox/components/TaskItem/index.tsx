import React from 'react';
import { observer } from 'mobx-react-lite';
import { TaskItemProps, TaskItemStoreProvider, useTaskItemStore } from './store';
import { TaskItemView } from './view';
import { TaskQuickEditorProps, TaskQuickEditorStoreProvider } from '../TaskQuickEditor/store';

const TaskItem = observer(function TaskItem(props: TaskItemProps & TaskQuickEditorProps) {
  return (
    <TaskItemStoreProvider {...props}>
      <TaskQuickEditorStoreProvider {...props} instance={() => useTaskItemStore().quickEdit}>
        <TaskItemView/>
      </TaskQuickEditorStoreProvider>
    </TaskItemStoreProvider>
  );
});

export default TaskItem;