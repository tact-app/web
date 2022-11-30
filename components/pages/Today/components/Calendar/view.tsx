import { observer } from 'mobx-react-lite';
import { CalendarProps, useCalendarStore } from './store';
import { Box } from '@chakra-ui/react';

export const CalendarView = observer(function CalendarView(
  props: CalendarProps
) {
  const store = useCalendarStore();

  return <Box pt={10} pl={6} pr={4}></Box>;
});
