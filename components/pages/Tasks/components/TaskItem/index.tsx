import { observer } from 'mobx-react-lite';
import { Stack, Text } from '@chakra-ui/react';
import { TaskData } from '../../store/types';
import { useTasksStore } from '../../store';
import { useCallback } from 'react';

const TaskItem = observer(function TaskItem({ item }: { item: TaskData }) {
  const store = useTasksStore();
  const openTask = useCallback(() => {
    store.openTask(item);
  }, [store, item])

  return (
    <Stack p='4' boxShadow='base' m='4' borderRadius='sm' onClick={store.openTask}>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justifyContent='space-between'>
        <Text fontSize={{ base: 'sm' }} textAlign={'left'} maxW={'4xl'}>
          {item.description}
        </Text>
      </Stack>
    </Stack>
  );
});

export default TaskItem;