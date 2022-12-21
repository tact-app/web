import { observer } from 'mobx-react-lite';
import { Box, BoxProps, Button, chakra } from '@chakra-ui/react';
import { useCalendarStore } from './store';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/pro-light-svg-icons';

const CalendarTableHeaderDate = observer(function CalendarTableHeaderDate({
  date,
  id,
  ...rest
}: {
  id: string;
  date: Date;
} & BoxProps) {
  const store = useCalendarStore();

  return (
    <Box
      overflow='hidden'
      minH={9}
      display='flex'
      justifyContent='center'
      flex={id === store.todayId && store.daysCount <= 3 ? 2 : 1}
      {...rest}
    >
      <chakra.div
        w={20}
        h={10}
        borderTopRadius='full'
        bg={id === store.todayId ? 'blue.50' : 'transparent'}
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

export const CalendarTableHeader = observer(function CalendarTableHeader() {
  const store = useCalendarStore();

  return (
    <Box display='flex' maxH={10} mt={6}>
      <chakra.div visibility='hidden'>
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
      <Box
        css={{
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
        w='100%'
        display='flex'
        position='relative'
      >
        {store.daysCount > 3 && (
          <Button
            onClick={store.prevPage}
            position='absolute'
            left={0}
            variant='outline'
            size='xs'
            bottom={1}
            color='gray.400'
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
        )}
        {store.days.map(({ date, id }) => (
          <CalendarTableHeaderDate key={id} date={date} id={id} />
        ))}
        {store.daysCount > 3 && (
          <Button
            onClick={store.nextPage}
            position='absolute'
            right={0}
            variant='outline'
            size='xs'
            bottom={1}
            color='gray.400'
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        )}
      </Box>
    </Box>
  );
});
