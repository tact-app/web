import { observer } from 'mobx-react-lite';
import { Box, Button, Center, Collapse, chakra, Fade } from '@chakra-ui/react';
import { ArrowDownIcon } from '../../../shared/Icons/ArrowIcons';
import React from 'react';
import { useTodayStore } from '../store';
import { HotkeyBlock } from '../../../shared/HotkeyBlock';
import { TasksListView } from '../../../shared/TasksList/view';
import { DraggableListDroppable } from '../../../shared/DraggableList/view';
import { TasksDroppablePlaceholder } from './TasksDroppablePlaceholder';

export const TasksListWeekly = observer(function TasksListWeekly() {
  const store = useTodayStore();

  return (
    <Box mt={8}>
      {store.weekList.hasTasks ? (
        <Fade in={store.weekList.hasTasks}>
          {store.todayListWithCreator.list.hasTasks && (
            <Center mb={10}>
              <chakra.span fontSize='md' fontWeight='normal' color='gray.400'>
                switch between lists
              </chakra.span>
              <HotkeyBlock hotkey='Alt+Shift+Up' />
              <HotkeyBlock hotkey='Alt+Shift+Down' />
            </Center>
          )}
          <DraggableListDroppable id='week-button'>
            <Button
              h={8}
              variant='ghost'
              onClick={store.toggleWeekList}
              display='flex'
              alignSelf='start'
              ml={5}
              mb={1}
              pr={2}
              pl={2}
            >
              Weekly tasks
              <chakra.div
                transition={'transform 0.2s ease-in-out'}
                transform={
                  store.isWeekExpanded ? 'rotate(180deg)' : 'rotate(0)'
                }
              >
                <ArrowDownIcon />
              </chakra.div>
            </Button>
          </DraggableListDroppable>
          <Collapse in={store.isWeekExpanded}>
            <TasksListView />
          </Collapse>
        </Fade>
      ) : (
        <TasksDroppablePlaceholder
          id='week'
          in={store.todayListWithCreator.list.draggableList.isDraggingActive}
        >
          Move to Weekly
        </TasksDroppablePlaceholder>
      )}
    </Box>
  );
});
