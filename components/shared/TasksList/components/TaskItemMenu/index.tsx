import { observer } from 'mobx-react-lite';
import { TaskItemStore, useTaskItemStore } from '../TaskItem/store';
import React from 'react';
import { TaskStatus } from '../../types';
import {
  faBan,
  faBullseyePointer,
  faCalendarCheck,
  faCircleCheck,
  faCircleExclamation,
  faHashtag,
  faICursor,
  faSquareArrowUpRight,
  faXmark,
  faSolarSystem,
} from '@fortawesome/pro-light-svg-icons';
import { faEllipsisVertical } from '@fortawesome/pro-solid-svg-icons';
import { ActionMenu } from "../../../ActionMenu";

const multiTaskItems = (store: TaskItemStore) => [
  {
    onClick: () => {
      store.parent.modals.openGoalAssignModal();
    },
    title: 'Assign to goal',
    icon: faBullseyePointer,
    hotkey: 'alt+g',
    command: '⌥G',
    hidden: store.disableGoalChange,
  },
  null,
  {
    onClick: () =>
      store.parent.setTasksStatus(
        store.parent.draggableList.focused,
        TaskStatus.DONE
      ),
    title: store.parent.canUnsetStatus(TaskStatus.DONE)
      ? 'Unmark as done'
      : 'Mark as done',
    icon: faCircleCheck,
    hotkey: ['alt+d', 'd'],
    command: '⌥D / D',
  },
  {
    onClick: () =>
      store.parent.setTasksStatus(
        store.parent.draggableList.focused,
        TaskStatus.WONT_DO
      ),
    title: store.parent.canUnsetStatus(TaskStatus.WONT_DO)
      ? 'Unmark as won’t do'
      : 'Mark as won’t do',
    icon: faBan,
    hotkey: ['alt+w', 'alt+shift+w'],
    command: '⌥W / ⌥⇧W',
  },
  null,
  {
    onClick: () => store.parent.sendTasks(store.parent.draggableList.focused),
    title: 'Move to ' + store.parent.tasksReceiverName,
    icon: faCalendarCheck,
    hotkey: 'alt+m',
    command: '⌥M',
    hidden: !store.parent.tasksReceiverName,
  },
  {
    onClick: () =>
      store.parent.deleteWithVerify(store.parent.draggableList.focused),
    title: 'Delete tasks',
    icon: faXmark,
    hotkey: ['backspace', 'meta+backspace'],
    command: '⌫ / ⌘⌫',
  },
];

const singleTaskItems = (store: TaskItemStore) => [
  {
    onClick: () => {
      store.parent.modals.openPriorityModal(store.task.id);
    },
    title: 'Change priority',
    icon: faCircleExclamation,
  },
  {
    onClick: () => {
      store.parent.modals.openAddTagModal(store.task.id);
    },
    title: 'Add hashtag',
    icon: faHashtag,
  },
  {
    onClick: () => {
      store.parent.modals.openGoalAssignModal(store.task.id);
    },
    title: 'Assign to goal',
    icon: faBullseyePointer,
    command: '⌥G',
    hotkey: 'alt+g',
    hidden: store.disableGoalChange,
  },
  {
    onClick: () => {
      store.parent.modals.openSpaceChangeModal(store.task.id);
    },
    title: 'Change space',
    icon: faSolarSystem,
    hotkey: ['alt+u'],
    command: '⌥U',
    hidden: store.disableSpaceChange,
  },
  null,
  {
    onClick: () =>
      store.parent.handleStatusChange(store.task.id, TaskStatus.DONE),
    title: store.parent.canUnsetStatus(TaskStatus.DONE)
      ? 'Unmark as done'
      : 'Mark as done',
    icon: faCircleCheck,
    hotkey: ['alt+d', 'd'],
    command: '⌥D / D',
  },
  {
    onClick: () =>
      store.parent.handleStatusChange(store.task.id, TaskStatus.WONT_DO),
    title: store.parent.canUnsetStatus(TaskStatus.WONT_DO)
      ? 'Unmark as won’t do'
      : 'Mark as won’t do',
    icon: faBan,
    hotkey: ['alt+w', 'alt+shift+w'],
    command: store.parent.canUnsetStatus(TaskStatus.WONT_DO)
      ? '⌥W'
      : '⌥W / ⌥⇧W',
  },
  null,
  {
    onClick: () => store.parent.sendTasks([store.task.id]),
    title: 'Move to ' + store.parent.tasksReceiverName,
    icon: faCalendarCheck,
    hotkey: 'alt+m',
    command: '⌥M',
    hidden: !store.parent.tasksReceiverName,
  },
  {
    onClick: () => {
      store.parent.openTask(store.task.id);

      if (!store.isFocused) {
        store.parent.draggableList.setFocusedItem(store.task.id);
      }
    },
    title: 'Open task',
    icon: faSquareArrowUpRight,
    hotkey: ['alt+o', 'enter'],
    command: '⌥O / ↵',
  },
  {
    onClick: () => {
      store.parent.setEditingTask(store.task.id);

      if (!store.isFocused) {
        store.parent.draggableList.setFocusedItem(store.task.id);
      }
    },
    title: 'Edit task',
    icon: faICursor,
    hotkey: 'space',
    command: '␣',
  },
  {
    onClick: () => store.parent.deleteWithVerify([store.task.id]),
    title: 'Delete task',
    icon: faXmark,
    hotkey: ['backspace', 'meta+backspace'],
    command: '⌫ / ⌘⌫',
  },
];

export const TaskItemMenu = observer(function TaskItemMenu() {
  const store = useTaskItemStore();

  const isMouseSelection = store.parent.draggableList.isMouseSelection;

  return (
    <ActionMenu
      isMenuOpen={store.isMenuOpen}
      triggerIcon={faEllipsisVertical}
      items={store.isMultiSelected ? multiTaskItems(store) : singleTaskItems(store)}
      hidden={!store.isDragging}
      triggerIconFontSize={18}
      xPosContextMenu={store.xPosContextMenu}
      isOpenByContextMenu={store.isOpenByContextMenu}
      onToggleMenu={store.toggleMenu}
      triggerButtonProps={() => ({
        color: 'gray.500',
        h: 'auto',

        _groupHover: {
          visibility: !isMouseSelection && 'visible',
        },
        _before: {
          content: '""',
          h: '1px',
          left: 0,
          bg: 'transparent',
          transitionProperty: 'background-color',
          transitionDuration: 'normal',
          position: 'absolute',
          top: '-1px',
          w: '100%',
        },
        _hover: {
          bg: 'gray.100',

          '&:before': {
            bg: 'gray.100',
          },
        },
        _focus: {
          bg: 'gray.100',
          boxShadow: 'none',

          '&:before': {
            bg: 'gray.100',
          },
        },
      })}
    />
  );
});
