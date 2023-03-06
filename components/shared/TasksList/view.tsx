import { observer } from 'mobx-react-lite';
import { TasksListProps, useTasksListStore } from './store';

import React from 'react';
import { TaskListItem } from './components/TaskListItem';
import { ModalsSwitcher } from '../../../helpers/ModalsController';
import { DraggableList } from '../DraggableList';
import { useHotkeysHandler } from '../../../helpers/useHotkeysHandler';
import { Center, Spinner } from '@chakra-ui/react';

export const TasksListView = observer(function TasksListView(
  { dnd = true }: TasksListProps
) {
  const store = useTasksListStore();

  useHotkeysHandler(store.keyMap, store.hotkeyHandlers, {
    enabled: store.isHotkeysEnabled,
  });

  return (
    <>
      {store.isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <DraggableList
          id={store.listId}
          isHotkeysEnabled={store.isHotkeysEnabled}
          dndActive={dnd}
          wrapperProps={
            dnd
              ? {
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
