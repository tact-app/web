import { observer } from 'mobx-react-lite';
import { useTasksStore } from '../../store';
import {
  Container,
  Heading,
  Box,
  HStack,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { TaskCreator } from '../TaskCreator';
import React from 'react';
import { TaskListItem } from '../TaskListItem';
import { ModalsSwitcher } from '../../../../../helpers/ModalsController';
import { DraggableList } from '../../../../shared/DraggableList';
import { FocusIcon } from '../../../../shared/Icons/FocusIcon';

const TaskList = observer(function TaskList() {
  const store = useTasksStore();

  return (
    <Container maxW='container.lg' p={0} h='100%'>
      <Box pl={5} pr={5} display='flex' flexDirection='column' h='100%'>
        <HStack justifyContent='space-between'>
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
        <TaskCreator
          onSave={store.createTask}
          onTagCreate={store.createTag}
          onNavigate={store.draggableList.handleNavigation}
          tagsMap={store.tagsMap}
          listId={store.listId}
          keepFocus
        />
        <DraggableList
          items={store.order}
          checkItemActivity={store.checkFocusModeMatch}
          content={TaskListItem}
          callbacks={store.draggableHandlers}
          instance={store.draggableList}
        />
      </Box>
      <ModalsSwitcher controller={store.modals.controller} />
    </Container>
  );
});

export default TaskList;
