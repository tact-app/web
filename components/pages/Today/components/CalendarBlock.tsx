import { observer } from 'mobx-react-lite';
import { Calendar } from './Calendar';
import React from 'react';
import { useTodayStore } from '../store';

export const CalendarBlock = observer(function CalendarBlock() {
  const store = useTodayStore();

  return (
    <Calendar
      dropItem={store.draggingTask}
      isCollapsed={!store.isCalendarExpanded}
      callbacks={store.calendarCallbacks}
    />
  );
});
