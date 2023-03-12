import { observer } from 'mobx-react-lite';
import {
  TasksListWithCreatorProps,
  useTasksListWithCreatorStore,
} from './store';
import { TaskCreator } from '../TaskCreator';
import React from 'react';
import { useHotkeysHandler } from '../../../helpers/useHotkeysHandler';
import TasksList from '../TasksList';

export const TasksListWithCreatorView = observer(
  function TasksListWithCreatorView(props: TasksListWithCreatorProps) {
    const store = useTasksListWithCreatorStore();

    useHotkeysHandler(store.keyMap, store.hotkeyHandlers, {
      enabled: store.isHotkeysEnabled,
    });

    return (
      <>
        <TaskCreator
          instance={store.creator}
          callbacks={store.taskCreatorCallbacks}
          input={props.input}
          keepFocus
          wrapperProps={{
            ml: props.dnd ? 5 : 0,
            mr: props.dnd ? 5 : 0,
          }}
          disableSpaceChange={props.disableSpaceChange}
          disableGoalChange={props.disableGoalChange}
        />
        <TasksList
          {...props}
          instance={store.list}
          callbacks={store.tasksListCallbacks}
        />
      </>
    );
  }
);
