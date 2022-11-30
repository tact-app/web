import { observer } from 'mobx-react-lite';
import { chakra } from '@chakra-ui/react';
import { useCalendarStore } from './store';

export const CalendarTimes = observer(function CalendarTimes() {
  const store = useCalendarStore();

  return (
    <chakra.div display='flex' flexDirection='column'>
      {store.times.map((time) => (
        <chakra.span
          key={time}
          position='relative'
          minH={36}
          pt={1}
          pr={1}
          fontSize='sm'
          fontWeight='normal'
          textAlign='end'
          _after={{
            content: '""',
            display: 'block',
            height: '1px',
            width: '100%',
            bg: 'gray.200',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {time}
        </chakra.span>
      ))}
    </chakra.div>
  );
});
