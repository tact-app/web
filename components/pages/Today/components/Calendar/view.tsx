import { observer } from 'mobx-react-lite';
import { CalendarProps, useCalendarStore } from './store';
import { Box, Heading, HStack } from '@chakra-ui/react';
import { CalendarColumn } from './CalendarColumn';
import { CalendarTimes } from './CalendarTimes';
import { CalendarHeader } from './CalendarHeader';

export const CalendarView = observer(function CalendarView(
  props: CalendarProps
) {
  const store = useCalendarStore();

  return (
    <Box
      pt={10}
      pl={6}
      pr={4}
      display='flex'
      flexDirection='column'
      h='100%'
      borderLeft='1px solid var(--chakra-colors-gray-200)'
    >
      <HStack>
        <Box display='flex' alignItems='center'>
          <Heading fontSize='2xl' fontWeight='semibold'>
            Calendar
          </Heading>
          <Heading
            size='md'
            as='h4'
            fontWeight='normal'
            color='gray.400'
            ml={3}
          >
            {store.today.toLocaleDateString('en', {
              year: 'numeric',
              month: 'long',
            })}
          </Heading>
        </Box>
      </HStack>
      <CalendarHeader />
      <Box
        overflow='auto'
        css={{
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
        ref={store.setContentRef}
      >
        <Box display='flex'>
          <CalendarTimes />
          {store.days.map((day, index) => (
            <CalendarColumn
              key={day.valueOf()}
              flex={index === 0 ? 2 : 1}
              index={index}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
});
