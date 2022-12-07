import { observer } from 'mobx-react-lite';
import { Modes, useTaskQuickEditorStore } from './store';
import { TaskPriorityIcon } from '../Icons/TaskPriorityIcon';
import React, { useEffect } from 'react';
import { Button, ButtonProps, chakra } from '@chakra-ui/react';
import { TaskQuickEditorMenu } from './TaskQuickEditorMenu';
import { TaskPriority, TaskPriorityNames } from '../TasksList/types';
import { TaskQuickEditorEmptyButton } from './TaskQuickEditorEmptyButton';

export const TaskQuickEditorPriority = observer(function TaskQuickEditPriority({
  withTitle,
  showEmpty,
  disabled,
  ...rest
}: {
  withTitle?: boolean;
  showEmpty?: boolean;
  disabled?: boolean;
} & ButtonProps) {
  const store = useTaskQuickEditorStore();
  const priority = store.modes.priority.priority;
  const bg =
    store.modes.priority.priority === TaskPriority.HIGH
      ? 'red'
      : store.modes.priority.priority === TaskPriority.MEDIUM
      ? 'orange'
      : 'blue';

  useEffect(() => {
    if (showEmpty) {
      store.modes.priority.setAlwaysFilled(true);
    }
  }, [store, showEmpty]);

  return priority !== TaskPriority.NONE ? (
    <Button
      ref={store.modes.priority.setButtonRef}
      tabIndex={disabled ? -1 : 0}
      onClick={(e) => {
        e.stopPropagation();
        store.suggestionsMenu.openFor(Modes.PRIORITY);
      }}
      onKeyDown={store.handleKeyDownModeButton(Modes.PRIORITY)}
      onFocus={store.handleModeFocus(Modes.PRIORITY)}
      variant='ghost'
      borderRadius='md'
      overflow='hidden'
      display='flex'
      justifyContent='flex-start'
      h={6}
      w={6}
      p={0}
      minW={6}
      bg={withTitle ? bg + '.50' : undefined}
      _hover={withTitle ? { bg: bg + '.75' } : undefined}
      _active={withTitle ? { bg: bg + '.100' } : undefined}
      _focus={{
        outline: 'none',
        boxShadow: 'none',
        bg: bg + '.100',
      }}
      {...rest}
    >
      <TaskQuickEditorMenu
        items={store.modes.priority.suggestions}
        openForMode={Modes.PRIORITY}
      />
      <chakra.div flex={1}>
        <TaskPriorityIcon priority={store.modes.priority.priority} />
      </chakra.div>
      {withTitle ? (
        <chakra.span fontSize='sm' fontWeight='normal' pl={1} pr={1}>
          {TaskPriorityNames[store.modes.priority.priority]}
        </chakra.span>
      ) : null}
    </Button>
  ) : showEmpty ? (
    <TaskQuickEditorEmptyButton
      {...rest}
      mode={Modes.PRIORITY}
      disabled={disabled}
      title='Set priority'
    />
  ) : null;
});
