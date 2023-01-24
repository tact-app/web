import { observer } from 'mobx-react-lite';
import TaskItem from '../TaskItem';
import React, { RefObject } from 'react';
import { useTasksListStore } from '../../store';

export const TaskListItem = observer(function TaskListItem({
  id,
  snapshot,
  menuPortalRef
}: {
  id: string;
  snapshot: any;
  menuPortalRef?: RefObject<HTMLDivElement>;
}) {
  const store = useTasksListStore();
  const task = store.items[id];

  return (
    task && (
      <TaskItem
        parent={store}
        task={task}
        highlightActiveTasks={store.highlightActiveTasks}
        isDragging={snapshot.isDragging}
        onFocus={store.draggableList.setFocusedItem}
        onStatusChange={store.handleStatusChange}
        onWontDoWithComment={store.handleWontDoWithComment}
        onToggleMenu={store.handleToggleMenu}
        callbacks={store.taskListItemCallbacks}
        menuPortalRef={menuPortalRef}
      />
    )
  );
});
