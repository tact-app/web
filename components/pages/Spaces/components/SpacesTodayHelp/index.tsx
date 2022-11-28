import {
  DrawerBody,
  DrawerHeader,
  Heading,
  chakra,
  CloseButton,
} from '@chakra-ui/react';
import TasksList from '../../../../shared/TasksList';
import { observer } from 'mobx-react-lite';
import { ResizableDrawer } from '../../../../shared/ResizableDrawer';
import React from 'react';
import { useSpacesStore } from '../../store';

export const SpacesTodayHelp = observer(function SpacesTodayHelp() {
  const store = useSpacesStore();

  return (
    <ResizableDrawer
      isOpen={store.isTodayHelpOpen}
      onClose={store.closeTodayHelp}
    >
      <DrawerHeader
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        <Heading size='lg'>Today</Heading>
        <CloseButton
          onClick={store.closeTodayHelp}
          color='gray.400'
          size='sm'
        />
      </DrawerHeader>
      <DrawerBody overflow='auto'>
        <TasksList isHotkeysEnabled={false} isReadOnly />
        <chakra.div />
      </DrawerBody>
    </ResizableDrawer>
  );
});
