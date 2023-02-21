import { observer } from 'mobx-react-lite';
import { Box, Container, Heading, HStack, IconButton, Tooltip, } from '@chakra-ui/react';
import { FocusIcon } from '../../../shared/Icons/FocusIcon';
import { TasksListWithCreatorStoreProvider } from '../../../shared/TasksListWithCreator/store';
import { TaskCreator } from '../../../shared/TaskCreator';
import { DraggableListContext } from '../../../shared/DraggableList/view';
import { TasksListStoreProvider } from '../../../shared/TasksList/store';
import { Lists } from '../../../shared/TasksList/constants';
import { TasksListToday } from './TasksListToday';
import { TasksListWeekly } from './TasksListWeekly';
import React from 'react';
import { TodayBlocks, useTodayStore } from '../store';
import { AnimatedBlock } from "../../../shared/AnimatedBlock";

export const ListsBlock = observer(function ListsBlock() {
  const store = useTodayStore();

  return (
    <AnimatedBlock
      component={Container}
      flex={1}
      maxW='container.lg'
      pt={10}
      h='100%'
      display='flex'
      flexDirection='column'
      overflow='hidden'
      animateParams={{
        condition: store.currentFocusedBlock === TodayBlocks.TODAY_LIST,
        deps: [store.currentFocusedBlock]
      }}
    >
      <Box display='flex' flexDirection='column' h='100%'>
        <HStack justifyContent='space-between' pl={5} pr={5}>
          <Heading size='lg' mt={2.5} mb={8} pt={4}>
            Today
          </Heading>
          <HStack>
            <Tooltip label='F / ⇧F' hasArrow>
              <IconButton
                aria-label='focus'
                variant='ghost'
                onClick={store.handleToggleFocusMode}
                stroke={store.isFocusModeActive ? 'blue.400' : 'gray.400'}
              >
                <FocusIcon />
              </IconButton>
            </Tooltip>
          </HStack>
        </HStack>
        <TasksListWithCreatorStoreProvider
          instance={store.todayListWithCreator}
          tasksListCallbacks={store.todayTasksListCallbacks}
          taskCreatorCallbacks={store.taskCreatorCallbacks}
        >
          <TaskCreator
            instance={store.todayListWithCreator.creator}
            callbacks={store.todayListWithCreator.taskCreatorCallbacks}
            keepFocus
            wrapperProps={{
              ml: 5,
              mr: 5,
            }}
          />
          <Box
            overflow='auto'
            css={{
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <DraggableListContext
              onDragStart={store.handleDragStart}
              onDragEnd={store.handleDragEnd}
              sensors={store.sensors}
            >
              <TasksListStoreProvider
                listId={Lists.TODAY}
                instance={store.todayListWithCreator.list}
                isHotkeysEnabled={store.isTasksListHotkeysEnabled}
                highlightActiveTasks={store.isFocusModeActive}
                checkTaskActivity={store.checkFocusModeMatch}
                callbacks={store.todayListWithCreator.tasksListCallbacks}
                tasksReceiverName='Week'
              >
                <TasksListToday />
              </TasksListStoreProvider>
              <TasksListStoreProvider
                listId={Lists.WEEK}
                instance={store.weekList}
                isHotkeysEnabled={store.isWeekListHotkeysEnabled}
                highlightActiveTasks={store.isFocusModeActive}
                checkTaskActivity={store.checkFocusModeMatch}
                callbacks={store.weekTasksListCallbacks}
                tasksReceiverName='Today'
              >
                <TasksListWeekly />
              </TasksListStoreProvider>
            </DraggableListContext>
          </Box>
        </TasksListWithCreatorStoreProvider>
      </Box>
    </AnimatedBlock>
  );
});
