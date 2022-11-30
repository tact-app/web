import { observer } from 'mobx-react-lite';
import { Box, BoxProps, chakra } from '@chakra-ui/react';
import { useCalendarStore } from './store';

const CalendarHeaderDate = observer(function CalendarHeaderDate({
  date,
  ...rest
}: {
  date: Date;
} & BoxProps) {
  return (
    <Box
      overflow='hidden'
      minH={9}
      display='flex'
      justifyContent='center'
      {...rest}
    >
      <chakra.div
        w={20}
        h={10}
        borderTopRadius='full'
        bg='blue.50'
        position='relative'
      >
        <chakra.span
          position='absolute'
          left={0}
          right={0}
          bottom={2}
          fontSize='sm'
          fontWeight='semibold'
          color='blue.400'
          textAlign='center'
        >
          {date.toLocaleDateString('en', {
            day: 'numeric',
            month: 'short',
          })}
        </chakra.span>
      </chakra.div>
    </Box>
  );
});

export const CalendarHeader = observer(function CalendarHeader() {
  const store = useCalendarStore();

  return (
    <Box display='flex' maxH={10} mt={6}>
      <chakra.div overflow='hidden' visibility='hidden'>
        <chakra.div display='flex' flexDirection='column'>
          {store.times.map((time) => (
            <chakra.span
              key={time}
              position='relative'
              pt={1}
              pr={1}
              fontSize='sm'
              fontWeight='normal'
            >
              {time}
            </chakra.span>
          ))}
        </chakra.div>
      </chakra.div>
      {store.days.map((day, index) => (
        <CalendarHeaderDate
          key={day.valueOf()}
          date={store.today}
          flex={index === 0 ? 2 : 1}
        />
      ))}
    </Box>
  );
});
