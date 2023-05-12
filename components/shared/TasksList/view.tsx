import { observer } from 'mobx-react-lite';
import { TasksListProps, useTasksListStore } from './store';

import React, { useRef } from 'react';
import { TaskListItem } from './components/TaskListItem';
import { ModalsSwitcher } from '../../../helpers/ModalsController';
import { DraggableList } from '../DraggableList';
import { useHotkeysHandler } from '../../../helpers/useHotkeysHandler';
import { Center, Spinner } from '@chakra-ui/react';
import { useOnClickOutside } from 'next/dist/client/components/react-dev-overlay/internal/hooks/use-on-click-outside';

export const TasksListView = observer(function TasksListView(
  { dnd = true, wrapperProps, unfocusWhenClickOutside }: TasksListProps
) {
  const store = useTasksListStore();

  const ref = useRef<HTMLDivElement>();

  useHotkeysHandler(store.keyMap, store.hotkeyHandlers, {
    enabled: store.isHotkeysEnabled,
  });
  useOnClickOutside(ref.current, () => {
    if (unfocusWhenClickOutside) {
      store.removeFocus();
    }
  });

  return (
    <>
      {store.isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <div ref={ref}>
          <DraggableList
            id={store.listId}
            isHotkeysEnabled={store.isHotkeysEnabled}
            dndActive={dnd}
            wrapperProps={
              dnd
                ? {
                  pl: 5,
                  ...wrapperProps,
                }
                : wrapperProps
            }
            items={store.order}
            checkItemActivity={store.checkTask}
            content={TaskListItem}
            callbacks={store.draggableHandlers}
            instance={store.draggableList}
          />
        </div>
      )}
      <ModalsSwitcher controller={store.modals.controller} />
    </>
  );
});
