import { observer } from 'mobx-react-lite';
import { EventTypes } from './constants';
import { Checkbox, chakra } from '@chakra-ui/react';
import { useCalendarStore } from './store';

export const CalendarTableEvent = observer(function CalendarTableEvent(props: {
  id: string;
}) {
  const store = useCalendarStore();

  const event = store.events[props.id];

  if (!event) {
    return null;
  }

  if (event.data.type === EventTypes.TASK) {
    return (
      <chakra.div display='flex' alignItems='center'>
        <chakra.span onClick={(e) => e.stopPropagation()} display='flex'>
          <Checkbox borderColor={event.color + '.300'} size='md' p={1} />
        </chakra.span>
        <chakra.span>{event.data.title}</chakra.span>
      </chakra.div>
    );
  } else {
    return <div>Time block</div>;
  }
});
