import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { DrawerHeader, DrawerBody } from '@chakra-ui/react';
import { useTaskDescriptionStore } from './store';
import { useTasksStore } from '../../store';
import { ResizableDrawer } from '../../../../shared/ResizableDrawer';

export const TaskDescriptionView = observer(function TaskDescriptionView() {
  const store = useTaskDescriptionStore();
  const tasksStore = useTasksStore();
  const ref = useRef<null | HTMLDivElement>(null);

  return (
    <ResizableDrawer
      isOpen={Boolean(tasksStore.openedTask)}
      onClose={tasksStore.closeTask}
    >
      <DrawerHeader borderBottomWidth='1px'>{store.data.title}</DrawerHeader>
      <DrawerBody>
        <div ref={ref} />
      </DrawerBody>
    </ResizableDrawer>
  );
});
