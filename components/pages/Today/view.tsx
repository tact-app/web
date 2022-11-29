import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import { Task } from '../../shared/Task';

import 'allotment/dist/style.css';
import { useHotkeysHandler } from '../../../helpers/useHotkeysHandler';
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Tooltip,
  chakra,
  Container,
} from '@chakra-ui/react';
import { FocusIcon } from '../../shared/Icons/FocusIcon';
import { useTodayStore } from './store';
import { ResizableGroup } from '../../shared/ResizableGroup';
import { FocusConfiguration } from './components/FocusConfiguration';
import { ResizableGroupChild } from '../../shared/ResizableGroup/ResizableGroupChild';
import { TasksListWeekly } from './components/TasksListWeekly';
import { DraggableListContext } from '../../shared/DraggableList/view';
import { TaskCreator } from '../../shared/TasksList/components/TaskCreator';
import TasksList from '../../shared/TasksList';
import { TasksListWithCreatorStoreProvider } from '../../shared/TasksListWithCreator/store';
import { TasksListStoreProvider } from '../../shared/TasksList/store';

export const TodayView = observer(function TodayView() {
  const store = useTodayStore();

  useHotkeysHandler(store.keyMap, store.hotkeyHandlers, {
    enabled: store.isHotkeysEnabled,
  });

  useEffect(() => {
    if (store.shouldSetFirstFocus) {
      store.setFirstFocus();
    }
  }, [store, store.shouldSetFirstFocus]);

  return (
    <>
      <Head>
        <title>Today</title>
      </Head>
      <Box display='flex' h='100%'>
        <ResizableGroup>
          <ResizableGroupChild
            index={0}
            config={store.resizableConfig[0]}
            borderRight='1px'
            borderColor='gray.100'
          >
            <chakra.div h='100%'>
              {store.isFocusModeActive && !store.isSilentFocusMode ? (
                <FocusConfiguration
                  instance={store.focusConfiguration}
                  callbacks={store.focusConfigurationCallbacks}
                  getItemsCount={store.getItemsCount}
                  goals={store.listWithCreator.list.goals}
                />
              ) : null}
            </chakra.div>
          </ResizableGroupChild>
          <ResizableGroupChild index={1} config={store.resizableConfig[1]}>
            <Container
              flex={1}
              maxW='container.lg'
              pt={10}
              h='100%'
              display='flex'
              flexDirection='column'
              overflow='hidden'
            >
              <Box display='flex' flexDirection='column' h='100%'>
                <HStack justifyContent='space-between' pl={5} pr={5}>
                  <Heading size='lg' mt={2.5} mb={8} pt={4}>
                    Today
                  </Heading>
                  <HStack>
                    <Tooltip label='F / ⇧ F' hasArrow>
                      <IconButton
                        aria-label='focus'
                        variant='ghost'
                        onClick={store.handleToggleFocusMode}
                        stroke={
                          store.isFocusModeActive ? 'blue.400' : 'gray.400'
                        }
                      >
                        <FocusIcon />
                      </IconButton>
                    </Tooltip>
                  </HStack>
                </HStack>
                <TasksListWithCreatorStoreProvider
                  instance={store.listWithCreator}
                  callbacks={store.tasksListCallbacks}
                >
                  <TaskCreator
                    instance={store.listWithCreator.creator}
                    callbacks={store.listWithCreator.taskCreatorCallbacks}
                    tagsMap={store.listWithCreator.list.tagsMap}
                    spaces={store.listWithCreator.list.spaces}
                    goals={store.listWithCreator.list.goals}
                    listId={store.listWithCreator.list.listId}
                    defaultSpaceId={
                      store.listWithCreator.list.input
                        ? store.listWithCreator.list.input.spaceId
                        : undefined
                    }
                    keepFocus
                    wrapperProps={{
                      ml: 5,
                      mr: 5,
                    }}
                  />
                  <Box overflow='auto'>
                    <DraggableListContext
                      onDragStart={store.handleDragStart}
                      onDragEnd={store.handleDragEnd}
                      sensors={store.sensors}
                    >
                      <TasksList
                        instance={store.listWithCreator.list}
                        listId='default'
                        isHotkeysEnabled={store.isTasksListHotkeysEnabled}
                        dnd={true}
                        highlightActiveTasks={store.isFocusModeActive}
                        checkTaskActivity={store.checkFocusModeMatch}
                        callbacks={store.listWithCreator.tasksListCallbacks}
                        tasksReceiverName='Week'
                      />
                      <TasksListStoreProvider
                        listId='week'
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
            </Container>
          </ResizableGroupChild>
          <ResizableGroupChild
            index={2}
            config={store.resizableConfig[2]}
            boxShadow='lg'
            onMouseDown={store.handleTaskMouseDown}
          >
            {store.taskProps.task && <Task {...store.taskProps} />}
          </ResizableGroupChild>
        </ResizableGroup>
      </Box>
    </>
  );
});
