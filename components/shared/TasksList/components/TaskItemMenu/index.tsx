import { observer } from 'mobx-react-lite';
import {
  Button,
  Fade,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
  chakra,
  Divider,
  forwardRef,
} from '@chakra-ui/react';
import { TaskItemMenuIcon } from '../../../Icons/TaskItemMenuIcon';
import { useTaskItemStore } from '../TaskItem/store';
import { useTasksListStore } from '../../store';
import React, { PropsWithChildren, useCallback, useState } from 'react';
import { TaskStatus } from '../../types';
import { Modes } from '../TaskQuickEditor/store';
import { useNavigationByRefs } from '../../../../../helpers/useNavigationByRefs';

const TaskItemMenuItem = forwardRef(
  (
    {
      onClick,
      command,
      children,
    }: PropsWithChildren<{
      onClick: () => void;
      command?: string;
    }>,
    ref
  ) => {
    const store = useTaskItemStore();
    const handleClick = useCallback(() => {
      store.closeMenu();
      onClick();
    }, [store, onClick]);

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        display='flex'
        justifyContent='space-between'
        variant='unstyled'
        borderRadius='none'
        _hover={{ bg: 'gray.100' }}
        _focus={{ outline: 'none', bg: 'gray.100', boxShadow: 'none' }}
        w='100%'
        pr={2}
        pl={2}
      >
        <chakra.span fontWeight='normal'>{children}</chakra.span>
        <chakra.span color='gray.400' fontWeight='normal'>
          {command}
        </chakra.span>
      </Button>
    );
  }
);

const TaskItemMenuItems = ({
  items,
  refs,
}: {
  refs: (index: number, el: HTMLButtonElement) => void;
  items: {
    onClick: () => void;
    command?: string;
    title: string;
  }[];
}) => {
  return (
    <>
      {items.map((item, index) =>
        item === null ? (
          <Divider key={index} />
        ) : (
          <TaskItemMenuItem
            ref={(el) => refs(index, el)}
            key={item.title}
            onClick={item.onClick}
            command={item.command}
          >
            {item.title}
          </TaskItemMenuItem>
        )
      )}
    </>
  );
};

const multiTaskItems = (store, tasksStore) => [
  {
    onClick: () => {
      tasksStore.setEditingTask(store.task.id);
      setTimeout(() => store.quickEdit.activateMode(Modes.PRIORITY));
    },
    title: 'Change priority',
  },
  {
    onClick: () => {
      tasksStore.modals.openGoalAssignModal(store.task.id);
    },
    command: '⌥G',
    title: 'Assign to goal',
  },
  null,
  {
    onClick: () =>
      tasksStore.handleStatusChange(store.task.id, TaskStatus.DONE),
    title: 'Mark as done',
    command: '⌥D',
  },
  {
    onClick: () =>
      tasksStore.handleStatusChange(store.task.id, TaskStatus.WONT_DO),
    title: 'Mark as won’t do',
    command: '⌥W / ⌥⇧W',
  },
  null,
  {
    onClick: () => tasksStore.deleteWithVerify([store.task.id]),
    title: 'Delete task',
    command: '⌫ / ⌘⌫',
  },
];

const singleTaskItems = (store, tasksStore) => [
  {
    onClick: () => {
      tasksStore.setEditingTask(store.task.id);
      setTimeout(() => store.quickEdit.activateMode(Modes.PRIORITY));
    },
    title: 'Change priority',
  },
  {
    onClick: () => {
      tasksStore.setEditingTask(store.task.id);
      setTimeout(() => store.quickEdit.activateMode(Modes.TAG));
    },
    title: 'Add tag',
  },
  {
    onClick: () => {
      tasksStore.modals.openGoalAssignModal(store.task.id);
    },
    command: '⌥G',
    title: 'Assign to goal',
  },
  null,
  {
    onClick: () =>
      tasksStore.handleStatusChange(store.task.id, TaskStatus.DONE),
    title: 'Mark as done',
    command: '⌥D',
  },
  {
    onClick: () =>
      tasksStore.handleStatusChange(store.task.id, TaskStatus.WONT_DO),
    title: 'Mark as won’t do',
    command: '⌥W / ⌥⇧W',
  },
  null,
  {
    onClick: () => {
      tasksStore.openTask(store.task.id);
      tasksStore.draggableList.setFocusedItem(store.task.id);
    },
    title: 'Open task',
    command: '↵',
  },
  {
    onClick: () => tasksStore.deleteWithVerify([store.task.id]),
    title: 'Delete task',
    command: '⌫ / ⌘⌫',
  },
];

const TaskItemMenuContent = observer(function TaskItemMenuContent({
  isOpen,
  stopAnimation,
}: {
  isOpen: boolean;
  stopAnimation: () => void;
}) {
  const { handleKeyDown, setRefs } = useNavigationByRefs();
  const store = useTaskItemStore();
  const tasksStore = useTasksListStore();

  return (
    <Portal>
      <Fade in={isOpen} unmountOnExit onAnimationComplete={stopAnimation}>
        <PopoverContent
          p={0}
          shadow='lg'
          overflow='hidden'
          w='auto'
          minW={64}
          onKeyDown={handleKeyDown}
        >
          <PopoverBody p={0}>
            <TaskItemMenuItems
              refs={setRefs}
              items={singleTaskItems(store, tasksStore)}
            />
          </PopoverBody>
        </PopoverContent>
      </Fade>
    </Portal>
  );
});

export const TaskItemMenu = observer(function TaskItemMenu() {
  const store = useTaskItemStore();
  const { isOpen, onClose, onOpen } = useDisclosure({
    isOpen: store.isMenuOpen,
  });
  const [isAnimationInProcess, setIsAnimationInProcess] = useState(false);

  const stopAnimation = useCallback(() => {
    setIsAnimationInProcess(false);
  }, [setIsAnimationInProcess]);

  const close = useCallback(() => {
    setIsAnimationInProcess(true);
    onClose();
    store.closeMenu();
  }, [onClose, store]);

  const open = useCallback(() => {
    setIsAnimationInProcess(true);
    onOpen();
    store.openMenu();
  }, [onOpen, store]);

  return (
    <Popover
      isLazy
      isOpen={isOpen || isAnimationInProcess}
      onOpen={open}
      onClose={close}
      placement={'bottom-start'}
    >
      <PopoverTrigger>
        <Button
          size='xs'
          p={0}
          variant='unstyled'
          h='auto'
          borderRadius='none'
          _groupHover={{
            visibility: 'visible',
          }}
          _hover={{
            bg: 'gray.100',
          }}
          _focus={{
            bg: 'gray.100',
            boxShadow: 'none',
          }}
          visibility={store.isDragging ? 'visible' : 'hidden'}
        >
          <TaskItemMenuIcon />
        </Button>
      </PopoverTrigger>
      {(isOpen || isAnimationInProcess) && (
        <TaskItemMenuContent isOpen={isOpen} stopAnimation={stopAnimation} />
      )}
    </Popover>
  );
});
