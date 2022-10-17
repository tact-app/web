import React from 'react';
import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import TaskList from './components/TaskList';
import { TaskDescription } from './components/TaskDescription';

import 'allotment/dist/style.css';
import { useTasksStore } from './store';
import { GlobalHotKeys } from 'react-hotkeys';

export const TasksView = observer(function TasksView() {
  const store = useTasksStore();

  return (
    <>
      <Head>
        <title>Inbox</title>
      </Head>
      <GlobalHotKeys
        keyMap={store.keyMap}
        handlers={store.hotkeyHandlers}
      >
        <TaskList/>
        {
          store.openedTask && <TaskDescription task={store.openedTaskData}/>
        }
      </GlobalHotKeys>
    </>
  );
});
