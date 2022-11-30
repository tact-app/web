import { observer } from 'mobx-react-lite';
import { chakra, HTMLChakraProps } from '@chakra-ui/react';
import { useCalendarStore } from './store';

export const CalendarColumn = observer(function CalendarColumn(
  props: HTMLChakraProps<'div'> & { index: number }
) {
  const store = useCalendarStore();

  return (
    <chakra.div
      position='relative'
      {...props}
      ref={(el) => store.setDayRef(props.index, el)}
    >
      <chakra.div
        display='flex'
        flexDirection='column'
        borderLeft='1px solid var(--chakra-colors-gray-200)'
        position='absolute'
        left={0}
        right={0}
      >
        {store.times.map((time) => (
          <chakra.span
            key={time}
            position='relative'
            minH={36}
            pt={1}
            fontSize='sm'
            fontWeight='normal'
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
          />
        ))}
      </chakra.div>
      <chakra.div />
    </chakra.div>
  );
});
