import { observer } from 'mobx-react-lite';
import {
  Fade,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { TaskItemMenuIcon } from '../../../Icons/TaskItemMenuIcon';
import { useTaskItemStore } from '../TaskItem/store';
import { useTasksListStore } from '../../store';
import React, { useCallback, useState } from 'react';
import { TaskStatus } from '../../types';
import { Modes } from '../TaskQuickEditor/store';

export const TaskItemMenu = observer(function TaskItemMenu() {
  const store = useTaskItemStore();
  const tasksStore = useTasksListStore();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isAnimationInProcess, setIsAnimationInProcess] = useState(false);

  const stopAnimation = useCallback(() => {
    setIsAnimationInProcess(false);
  }, [setIsAnimationInProcess]);

  const close = useCallback(() => {
    setIsAnimationInProcess(true);
    onClose();
    tasksStore.closeItemMenu();
  }, [onClose, tasksStore]);

  const open = useCallback(() => {
    setIsAnimationInProcess(true);
    onOpen();
    tasksStore.openItemMenu();
  }, [onOpen, tasksStore]);

  return (
    <Menu
      isLazy
      isOpen={isOpen || isAnimationInProcess}
      onOpen={open}
      onClose={close}
    >
      <MenuButton
        _groupHover={{
          visibility: 'visible',
        }}
        _focus={{
          bg: 'gray.100',
        }}
        visibility={store.isDragging || store.isFocused ? 'visible' : 'hidden'}
      >
        <TaskItemMenuIcon />
      </MenuButton>
      {(isOpen || isAnimationInProcess) && (
        <Portal>
          <Fade in={isOpen} unmountOnExit onAnimationComplete={stopAnimation}>
            <MenuList p={0} shadow='lg'>
              <MenuItem
                onClick={() => {
                  tasksStore.setEditingTask(store.task.id);
                  setTimeout(() =>
                    store.quickEdit.activateMode(Modes.PRIORITY)
                  );
                }}
              >
                Set priority
              </MenuItem>
              <MenuItem
                onClick={() => {
                  tasksStore.setEditingTask(store.task.id);
                  setTimeout(() => store.quickEdit.activateMode(Modes.TAG));
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
                  tasksStore.handleStatusChange(store.task.id, TaskStatus.DONE)
                }
              >
                Done
              </MenuItem>
              <MenuItem
                command='W / ⇧W'
                onClick={() =>
                  tasksStore.handleStatusChange(
                    store.task.id,
                    TaskStatus.WONT_DO
                  )
                }
              >
                Won&apos;t do
              </MenuItem>
              <MenuDivider m={0} />
              <MenuItem
                command='↵'
                onClick={() => tasksStore.openTask(store.task.id)}
              >
                Edit task
              </MenuItem>
              <MenuItem
                command='⌫'
                onClick={() => tasksStore.deleteWithVerify([store.task.id])}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Fade>
        </Portal>
      )}
    </Menu>
  );
});
