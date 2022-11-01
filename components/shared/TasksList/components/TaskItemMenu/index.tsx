import { observer } from 'mobx-react-lite';
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
} from '@chakra-ui/react';
import { TaskItemMenuIcon } from '../../../Icons/TaskItemMenuIcon';
import { useTaskItemStore } from '../TaskItem/store';
import { useTasksListStore } from '../../store';
import React from 'react';
import { TaskStatus } from '../../types';

export const TaskItemMenu = observer(function TaskItemMenu() {
  const store = useTaskItemStore();
  const tasksStore = useTasksListStore();

  return (
    <Menu
      isLazy
      onOpen={tasksStore.openItemMenu}
      onClose={tasksStore.closeItemMenu}
    >
      <MenuButton
        _groupHover={{
          visibility: 'visible',
        }}
        visibility={store.isDragging || store.isFocused ? 'visible' : 'hidden'}
      >
        <TaskItemMenuIcon />
      </MenuButton>
      <Portal>
        <MenuList p={0} shadow='lg'>
          <MenuItem
            onClick={() => {
              tasksStore.setEditingTask(store.task.id);
              setTimeout(() => store.quickEdit.startPriority());
            }}
          >
            Set priority
          </MenuItem>
          <MenuItem
            onClick={() => {
              tasksStore.setEditingTask(store.task.id);
              setTimeout(() => store.quickEdit.startTag());
            }}
          >
            Add tag
          </MenuItem>
          <MenuItem
            command='G'
            onClick={() => {
              tasksStore.modals.openGoalAssignModal(store.task.id);
            }}
          >
            Assign goal
          </MenuItem>
          <MenuDivider m={0} />
          <MenuItem
            command='D'
            onClick={() =>
              tasksStore.setTaskStatus(store.task.id, TaskStatus.DONE)
            }
          >
            Done
          </MenuItem>
          <MenuItem
            command='W / ⇧W'
            onClick={() =>
              tasksStore.setTaskStatus(store.task.id, TaskStatus.WONT_DO)
            }
          >
            Won&apos;t do
          </MenuItem>
          <MenuDivider m={0} />
          <MenuItem>Edit task</MenuItem>
          <MenuItem
            command='⌫'
            onClick={() => tasksStore.deleteTasks([store.task.id])}
          >
            Delete
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
});
