import { observer } from 'mobx-react-lite';
import TaskItem from '../TaskItem';
import React from 'react';
import { useTasksListStore } from '../../store';

export const TaskListItem = observer(function TaskListItem({
  id,
  snapshot,
}: {
  id: string;
  snapshot: any;
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
        tagsMap={store.tagsMap}
        spaces={store.spaces}
        goals={store.goals}
        listId={store.listId}
        onFocus={store.draggableList.setFocusedItem}
        onStatusChange={store.handleStatusChange}
        onWontDoWithComment={store.handleWontDoWithComment}
        onToggleMenu={store.handleToggleMenu}
        callbacks={store.taskListItemCallbacks}
      />
    )
  );
});
