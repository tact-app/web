import { observer } from 'mobx-react-lite';
import { EventTypes } from './constants';
import { Checkbox, chakra } from '@chakra-ui/react';
import { useCalendarStore } from './store';
import { useCallback, MouseEvent } from 'react';
import { TaskStatus } from '../../../../shared/TasksList/types';

export const CalendarTableEvent = observer(function CalendarTableEvent(props: {
  id: string;
}) {
  const store = useCalendarStore();

  const event = store.events[props.id];
  const stop = useCallback((e: MouseEvent) => e.stopPropagation(), []);

  if (!event) {
    return null;
  }

  if (event.data && event.data.type === EventTypes.TASK) {
    const task = store.tasks[event.data.id];

    return (
      <chakra.div display='flex' alignItems='center'>
        <chakra.span onClick={stop} display='flex'>
          <Checkbox
            borderColor={event.color + '.300'}
            size='md'
            p={1}
            variant='indeterminateUnfilled'
            isChecked={task.status === TaskStatus.DONE}
            isIndeterminate={task.status === TaskStatus.WONT_DO}
          />
        </chakra.span>
        <chakra.span>{task.title}</chakra.span>
      </chakra.div>
    );
  } else {
    return <div>Time block</div>;
  }
});
