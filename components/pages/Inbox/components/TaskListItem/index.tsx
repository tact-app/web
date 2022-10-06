import { observer } from 'mobx-react-lite';
import { Box, chakra } from '@chakra-ui/react';
import { TaskDragIcon } from '../TaskIcons/TaskDragIcon';
import TaskItem from '../TaskItem';
import React, { PropsWithChildren } from 'react';
import { TaskData } from '../../store/types';
import { useTasksStore } from '../../store';

export const TaskListItem = observer(function TaskListItem({
                                                             provided,
                                                             snapshot,
                                                             task,
                                                             index
                                                           }: {
  task: TaskData,
  index: number,
  provided: any,
  snapshot: any
}) {
  const store = useTasksStore();

  return (
    <Box
      ref={provided.innerRef}
      {...provided.draggableProps}
      item={task}
      index={index}
      role='group'
      display='flex'
      style={provided.draggableProps.style}
    >
      <chakra.div
        alignSelf='center'
        display='flex'
        visibility={snapshot.isDragging && !store.isControlDraggingActive ? 'visible' : 'hidden'}
        flexDirection='column'
        justifyContent='center'
        mr={1}
        _groupHover={{
          visibility: !store.isDraggingActive ? 'visible' : 'hidden',
        }}
        {...provided.dragHandleProps}
      >
        <TaskDragIcon/>
      </chakra.div>
      <TaskItem
        task={task}
        isFocused={store.focusedTaskIds.includes(task.id)}
        isDragging={snapshot.isDragging}
        isEditMode={store.editingTaskId && task.id === store.editingTaskId}
        onFocus={store.setFocusedTask}
        onNavigate={store.handleNavigation}
        onStatusChange={store.setTaskStatus}
        tags={store.tagsMap}
      />
    </Box>
  );
});