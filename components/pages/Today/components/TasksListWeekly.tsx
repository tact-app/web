import { observer } from 'mobx-react-lite';
import { Box, Button, Center, Collapse, chakra, Fade } from '@chakra-ui/react';
import { ArrowDownIcon } from '../../../shared/Icons/ArrowIcons';
import React from 'react';
import { useTodayStore } from '../store';
import { HotkeyBlock } from '../../../shared/HotkeyBlock';
import { TasksListView } from '../../../shared/TasksList/view';
import { DraggableListDroppable } from '../../../shared/DraggableList/view';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarLines } from '@fortawesome/pro-light-svg-icons';

export const TasksListWeekly = observer(function TasksListWeekly() {
  const store = useTodayStore();

  return (
    <Box mt={8}>
      {store.weekList.hasTasks ? (
        <Fade in={store.weekList.hasTasks}>
          <Center mb={10}>
            <chakra.span fontSize='md' fontWeight='normal' color='gray.400'>
              switch between lists
            </chakra.span>
            <HotkeyBlock hotkey='Shift+Alt+ArrowUp' />
            <HotkeyBlock hotkey='Shift+Alt+ArrowDown' />
          </Center>
          <DraggableListDroppable id='week-button'>
            <Button
              variant='unstyled'
              onClick={store.toggleWeekList}
              display='flex'
              alignSelf='start'
              ml={5}
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
            <TasksListView dnd={true} />
          </Collapse>
        </Fade>
      ) : (
        <Fade in={store.listWithCreator.list.draggableList.isDraggingActive}>
          <DraggableListDroppable id='week' pr={5} pl={5}>
            <Box
              color='gray.400'
              minH={12}
              w='100%'
              borderRadius='lg'
              bg='gray.75'
              display='flex'
              justifyContent='center'
              alignItems='center'
            >
              <FontAwesomeIcon icon={faCalendarLines} />
              <chakra.span ml={2.5}>Move to Weekly</chakra.span>
            </Box>
          </DraggableListDroppable>
        </Fade>
      )}
    </Box>
  );
});
