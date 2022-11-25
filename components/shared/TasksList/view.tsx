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
      {store.isCreatorEnabled && (
        <TaskCreator
          callbacks={store.taskCreatorCallbacks}
          tagsMap={store.tagsMap}
          spaces={store.spaces}
          goals={store.goals}
          listId={store.listId}
          defaultSpaceId={store.input ? store.input.spaceId : undefined}
          keepFocus
          wrapperProps={{
            ml: props.dnd ? 5 : 0,
            mr: props.dnd ? 5 : 0,
          }}
        />
      )}
      {store.isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <DraggableList
          isHotkeysEnabled={store.isHotkeysEnabled}
          dndActive={props.dnd}
          wrapperProps={
            props.dnd
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
