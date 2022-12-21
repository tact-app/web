import { observer } from 'mobx-react-lite';
import { chakra } from '@chakra-ui/react';
import { useCalendarStore } from './store';

export const CalendarTableTimes = observer(function CalendarTableTimes() {
  const store = useCalendarStore();

  return (
    <chakra.div display='flex' flexDirection='column'>
      {store.times.map((time) => (
        <chakra.span
          key={time}
          minH={store.hourHeight}
          pt={1}
          pr={1}
          fontSize='sm'
          fontWeight='normal'
          textAlign='end'
          _before={{
            content: '""',
            display: 'block',
            height: '1px',
            width: '100%',
            bg: 'gray.200',
            position: 'absolute',
            left: 0,
            transform: 'translateY(-4px)',
          }}
        >
          {time}
        </chakra.span>
      ))}
    </chakra.div>
  );
});
