import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  TaskItemProps,
  TaskItemStoreProvider,
  useTaskItemStore,
} from './store';
import { TaskItemView } from './view';
import {
  Modes,
  TaskQuickEditorProps,
  TaskQuickEditorStoreProvider,
} from '../TaskQuickEditor/store';

const useTasksItemStoreInstance = () => useTaskItemStore().quickEdit;

const modesOrder = [Modes.PRIORITY, Modes.TAG];

const TaskItem = observer(function TaskItem(
  props: TaskItemProps & TaskQuickEditorProps
) {
  return (
    <TaskItemStoreProvider {...props}>
      <TaskQuickEditorStoreProvider
        {...props}
        order={modesOrder}
        useInstance={useTasksItemStoreInstance}
      >
        <TaskItemView {...props} />
      </TaskQuickEditorStoreProvider>
    </TaskItemStoreProvider>
  );
});

export default TaskItem;
