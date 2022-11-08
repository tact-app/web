import { observer } from 'mobx-react-lite';
import { Modes, useTaskQuickEditorStore } from './store';
import { TaskPriorityIcon } from '../../../Icons/TaskPriorityIcon';
import React from 'react';
import { Button } from '@chakra-ui/react';
import { TaskQuickEditorMenu } from './TaskQuickEditorMenu';
import { TaskPriority } from '../../types';

export const TaskQuickEditorPriority = observer(
  function TaskQuickEditPriority() {
    const store = useTaskQuickEditorStore();
    const priority = store.modes.priority.priority;

    return priority !== TaskPriority.NONE ? (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          store.suggestionsMenu.openFor(Modes.PRIORITY);
        }}
        onKeyDown={store.handleKeyDownWithModeMenu(Modes.PRIORITY)}
        variant='ghost'
        borderRadius='md'
        overflow='hidden'
        display='flex'
        justifyContent='center'
        h={6}
        w={6}
        p={0}
        minW={6}
      >
        <TaskPriorityIcon priority={store.modes.priority.priority} />
        <TaskQuickEditorMenu
          items={store.modes.priority.suggestions}
          openForMode={Modes.PRIORITY}
        />
      </Button>
    ) : null;
  }
);
