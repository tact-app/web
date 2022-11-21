import React from 'react';
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
import TasksList from '../../shared/TasksList';
import { FocusIcon } from '../../shared/Icons/FocusIcon';
import { useTasksStore } from './store';
import { ResizableGroup } from '../../shared/ResizableGroup';
import { FocusConfiguration } from './components/FocusConfiguration';
import { ResizableGroupChild } from '../../shared/ResizableGroup/ResizableGroupChild';

export const TasksView = observer(function TasksView() {
  const store = useTasksStore();

  useHotkeysHandler(store.keyMap, store.hotkeyHandlers);

  return (
    <>
      <Head>
        <title>Tasks</title>
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
                  goals={store.list.goals}
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
                <TasksList
                  callbacks={store.tasksListCallbacks}
                  isHotkeysEnabled={store.isTasksListHotkeysEnabled}
                  dnd={true}
                  instance={store.list}
                  highlightActiveTasks={store.isFocusModeActive}
                  checkTaskActivity={store.checkFocusModeMatch}
                />
              </Box>
            </Container>
          </ResizableGroupChild>
          <ResizableGroupChild
            index={2}
            config={store.resizableConfig[2]}
            boxShadow='lg'
          >
            {store.list.openedTask && (
              <Task
                task={store.list.openedTaskData}
                spaces={store.list.spaces}
                tagsMap={store.list.tagsMap}
                goals={store.list.goals}
                hasNext={store.list.hasNextTask}
                hasPrevious={store.list.hasPrevTask}
                isExpanded={store.isTaskExpanded}
                isEditorFocused={store.list.isEditorFocused}
                callbacks={store.taskCallbacks}
              />
            )}
          </ResizableGroupChild>
        </ResizableGroup>
      </Box>
    </>
  );
});
