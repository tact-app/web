import React from 'react';
import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import { Task } from '../../shared/Task';

import 'allotment/dist/style.css';
import { useHotkeysHandler } from '../../../helpers/useHotkeysHandler';
import {
  Box,
  Container,
  Heading,
  HStack,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import TasksList from '../../shared/TasksList';
import { FocusIcon } from '../../shared/Icons/FocusIcon';
import { useTasksStore } from './store';
import { ResizableDrawer } from '../../shared/ResizableDrawer';

export const TasksView = observer(function TasksView() {
  const store = useTasksStore();

  useHotkeysHandler(store.keyMap, store.hotkeyHandlers, {
    enabled: store.isHotkeysEnabled,
  });

  return (
    <>
      <Head>
        <title>Tasks</title>
      </Head>
      <Box display='flex' h='100%'>
        <Container maxW='container.lg' p={4} pb={0} h='100%'>
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
                    stroke={store.isFocusModeActive ? 'blue.400' : 'gray.400'}
                  >
                    <FocusIcon />
                  </IconButton>
                </Tooltip>
              </HStack>
            </HStack>
            <TasksList
              callbacks={store.tasksListCallbacks}
              dnd={true}
              instance={store.list}
              highlightActiveTasks={store.isFocusModeActive}
              checkTaskActivity={store.checkFocusModeMatch}
            />
          </Box>
        </Container>
        {store.list.openedTask && (
          <ResizableDrawer
            isOpen={!!store.list.openedTaskData}
            onClose={store.list.closeTask}
            full={store.isTaskExpanded}
          >
            <Box p={6} h='100%'>
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
            </Box>
          </ResizableDrawer>
        )}
      </Box>
    </>
  );
});
