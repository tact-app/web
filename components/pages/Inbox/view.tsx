import React from 'react';
import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import TaskList from './components/TaskList';
import { Task } from './components/Task';

import 'allotment/dist/style.css';
import { useTasksStore } from './store';
import { useHotkeysHandler } from '../../../helpers/useHotkeysHandler';
import { Box } from '@chakra-ui/react';

export const TasksView = observer(function TasksView() {
  const store = useTasksStore();

  useHotkeysHandler(store.keyMap, store.hotkeyHandlers);

  return (
    <>
      <Head>
        <title>Inbox</title>
      </Head>
      <Box display='flex' h='100%'>
        <TaskList />
        {store.openedTask && (
          <Task
            task={store.openedTaskData}
            callbacks={{
              onClose: store.closeTask,
              onPreviousItem: store.draggableList.focusPrevItem,
              onNextItem: store.draggableList.focusNextItem,
            }}
          />
        )}
      </Box>
    </>
  );
});
