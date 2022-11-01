import { observer } from 'mobx-react-lite';
import { TasksListProps, useTasksListStore } from './store';

import { TaskCreator } from './components/TaskCreator';
import React from 'react';
import { TaskListItem } from './components/TaskListItem';
import { ModalsSwitcher } from '../../../helpers/ModalsController';
import { DraggableList } from '../DraggableList';
import { useHotkeysHandler } from '../../../helpers/useHotkeysHandler';
import { Center, Spinner } from '@chakra-ui/react';

export const TasksListView = observer(function TasksListView(
  props: TasksListProps
) {
  const store = useTasksListStore();

  useHotkeysHandler(store.keyMap, store.hotkeyHandlers, {
    enabled: store.isHotkeysEnabled,
  });

  return (
    <>
      <TaskCreator
        onSave={store.createTask}
        onTagCreate={store.createTag}
        onNavigate={store.draggableList.handleNavigation}
        tagsMap={store.tagsMap}
        listId={store.listId}
        keepFocus
        wrapperProps={{
          ml: props.dnd ? 5 : 0,
          mr: props.dnd ? 5 : 0,
        }}
      />
      {store.isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <DraggableList
          dndActive={props.dnd}
          wrapperProps={
            props.dnd
              ? {
                  pr: 5,
                  pl: 5,
                }
              : {}
          }
          items={store.order}
          checkItemActivity={store.checkTask}
          content={TaskListItem}
          callbacks={store.draggableHandlers}
          instance={store.draggableList}
        />
      )}
      <ModalsSwitcher controller={store.modals.controller} />
    </>
  );
});
