import { observer } from 'mobx-react-lite';
import {
  TasksListWithCreatorProps,
  useTasksListWithCreatorStore,
} from './store';
import { TaskCreator } from '../TasksList/components/TaskCreator';
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
          tagsMap={store.list.tagsMap}
          spaces={store.list.spaces}
          goals={store.list.goals}
          listId={store.list.listId}
          defaultSpaceId={
            store.list.input ? store.list.input.spaceId : undefined
          }
          keepFocus
          wrapperProps={{
            ml: props.dnd ? 5 : 0,
            mr: props.dnd ? 5 : 0,
          }}
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
