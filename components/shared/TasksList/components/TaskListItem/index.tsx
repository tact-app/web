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
  const focusMatch = store.checkTask(id);

  return (
    task && (
      <TaskItem
        task={task}
        highlightActiveTasks={store.highlightActiveTasks}
        isReadOnly={store.isReadOnly}
        isDisabled={!focusMatch}
        isFocused={store.draggableList.focused.includes(task.id)}
        isDragging={snapshot.isDragging}
        isEditMode={store.editingTaskId && task.id === store.editingTaskId}
        tagsMap={store.tagsMap}
        spaces={store.spaces}
        listId={store.listId}
        onFocus={store.draggableList.setFocusedItem}
        onNavigate={store.draggableList.handleNavigation}
        onStatusChange={store.setTaskStatus}
        onSave={store.updateTask}
        onTagCreate={store.createTag}
      />
    )
  );
});
