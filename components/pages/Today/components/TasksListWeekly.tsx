import { observer } from 'mobx-react-lite';
import { Box, Button, chakra, Collapse } from '@chakra-ui/react';
import { ArrowDownIcon } from '../../../shared/Icons/ArrowIcons';
import TasksList from '../../../shared/TasksList';
import React from 'react';
import { useTodayStore } from '../store';

export const TasksListWeekly = observer(function TasksListWeekly() {
  const store = useTodayStore();

  return (
    <Box>
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
          transform={store.isWeekExpanded ? 'rotate(180deg)' : 'rotate(0)'}
        >
          <ArrowDownIcon />
        </chakra.div>
      </Button>
      <Collapse in={store.isWeekExpanded}>
        <TasksList
          listId='week'
          instance={store.weekList}
          isHotkeysEnabled={store.isTasksListHotkeysEnabled}
          dnd={true}
          highlightActiveTasks={store.isFocusModeActive}
          checkTaskActivity={store.checkFocusModeMatch}
        />
      </Collapse>
    </Box>
  );
});
