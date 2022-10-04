import React, { useCallback, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Input, Stack, Text } from '@chakra-ui/react';
import { TaskData } from '../../store/types';
import { useTasksStore } from '../../store';

const TaskItem = observer(function TaskItem({ item }: { item: TaskData }) {
  const store = useTasksStore();
  const openTask = useCallback(() => store.openTask(item), [store, item]);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && store.focusedTask && store.focusedTask.id === item.id) {
      ref.current.focus();
    } else if (ref.current) {
      ref.current.blur();
    }
  }, [ref, store.focusedTask]);

  return (
    <Stack p='4' boxShadow='base' bg='white' borderRadius='sm' onClick={openTask}>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justifyContent='space-between'>
        <Input ref={ref} value={item.title} onKeyDown={store.handleTaskKeyDown(item)} onFocus={store.handleTaskFocus(item)}/>
      </Stack>
    </Stack>
  );
});

export default TaskItem;