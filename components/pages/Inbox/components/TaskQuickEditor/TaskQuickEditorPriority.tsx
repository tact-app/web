import { observer } from 'mobx-react-lite';
import { useTaskQuickEditorStore } from './store';
import { TaskPriorityIcon } from '../../../../shared/Icons/TaskPriorityIcon';
import React from 'react';

export const TaskQuickEditorPriority = observer(
  function TaskQuickEditPriority() {
    const store = useTaskQuickEditorStore();

    return <TaskPriorityIcon priority={store.priority} />;
  }
);
