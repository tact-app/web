import { observer } from 'mobx-react-lite';
import { useTaskQuickEditorStore } from './store';
import { TaskPriority } from '../../types';
import { TaskPriorityMenu } from '../TaskPriorityMenu';
import React, { PropsWithChildren } from 'react';

export const TaskQuickEditorPriorityMenu = observer(
  function TaskQuickEditorPriorityMenu({ children }: PropsWithChildren) {
    const store = useTaskQuickEditorStore();

    return store.priority !== TaskPriority.NONE ? (
      <TaskPriorityMenu onSelect={store.setPriorityAndCommit}>
        {children}
      </TaskPriorityMenu>
    ) : null;
  }
);
