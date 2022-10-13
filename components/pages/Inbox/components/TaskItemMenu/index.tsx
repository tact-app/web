import { observer } from 'mobx-react-lite';
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList } from '@chakra-ui/react';
import { TaskItemMenuIcon } from '../../../../shared/Icons/TaskItemMenuIcon';
import { useTaskItemStore } from '../TaskItem/store';
import { useTasksStore } from '../../store';
import React from 'react';
import { TaskStatus } from '../../types';

export const TaskItemMenu = observer(function TaskItemMenu() {
  const store = useTaskItemStore();
  const tasksStore = useTasksStore();

  return (
    <Menu isLazy onOpen={tasksStore.openItemMenu} onClose={tasksStore.closeItemMenu}>
      <MenuButton
        _groupHover={{
          visibility: 'visible',
        }}
        visibility={store.isDragging || store.isFocused ? 'visible' : 'hidden'}
      >
        <TaskItemMenuIcon/>
      </MenuButton>
      <MenuList p={0} shadow='lg'>
        <MenuItem onClick={() => {
          tasksStore.setEditingTask(store.task.id);
          setTimeout(() => store.quickEdit.startPriority());
        }}>Set priority</MenuItem>
        <MenuItem onClick={() => {
          tasksStore.setEditingTask(store.task.id);
          setTimeout(() => store.quickEdit.startTag());
        }}>Add tag</MenuItem>
        <MenuDivider m={0}/>
        <MenuItem command='D' onClick={() => tasksStore.setTaskStatus(store.task.id, TaskStatus.DONE)}>Done</MenuItem>
        <MenuItem command='W / ⇧W' onClick={() => tasksStore.setTaskStatus(store.task.id, TaskStatus.WONT_DO)}>Won&apos;t do</MenuItem>
        <MenuDivider m={0}/>
        <MenuItem>Edit task</MenuItem>
        <MenuItem command='⌫' onClick={() => tasksStore.deleteTasks([store.task.id])}>Delete</MenuItem>
      </MenuList>
    </Menu>
  );
});
