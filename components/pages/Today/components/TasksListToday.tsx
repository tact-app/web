import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTodayStore } from '../store';
import { Box, Text } from '@chakra-ui/react';
import { TasksListView } from '../../../shared/TasksList/view';
import { TasksDroppablePlaceholder } from './TasksDroppablePlaceholder';
import { Lists } from '../../../shared/TasksList/constants';

export const TasksListToday = observer(function TasksListToday() {
  const store = useTodayStore();

  return (
    <Box>
      {store.todayListWithCreator.list.hasTasks || !store.weekList.hasTasks ? (
        <TasksListView dnd={true} />
      ) : (
        <Box
          h={56}
          display='flex'
          justifyContent='center'
          alignItems='normal'
          flexDirection='column'
          position='relative'
        >
          <Text
            color='gray.400'
            fontSize='xl'
            fontWeight='normal'
            position='absolute'
            left={0}
            right={0}
            textAlign='center'
          >
            Plan your day
          </Text>
          <TasksDroppablePlaceholder
            id={Lists.TODAY}
            in={store.weekList.draggableList.isDraggingActive}
          >
            Move to Today
          </TasksDroppablePlaceholder>
        </Box>
      )}
    </Box>
  );
});
