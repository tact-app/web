import { observer } from 'mobx-react-lite';
import TaskItem from '../TaskItem';
import React from 'react';
import { useTasksStore } from '../../store';

export const TaskListItem = observer(function TaskListItem({
  id,
  snapshot,
}: {
  id: string;
  snapshot: any;
}) {
  const store = useTasksStore();
  const task = store.items[id];
  const focusMatch = store.checkFocusModeMatch(id);

  return (
    <TaskItem
      task={task}
      isFocusModeActive={store.isFocusModeActive}
      isDisabled={!focusMatch}
      isFocused={store.draggableList.focused.includes(task.id)}
      isDragging={snapshot.isDragging}
      isEditMode={store.editingTaskId && task.id === store.editingTaskId}
      tagsMap={store.tagsMap}
      listId={store.listId}
      onSuggestionsMenuOpen={store.handleSuggestions}
      onFocus={store.draggableList.setFocusedItem}
      onNavigate={store.draggableList.handleNavigation}
      onStatusChange={store.setTaskStatus}
      onSave={store.updateTask}
      onTagCreate={store.createTag}
    />
  );
});
