import { observer } from 'mobx-react-lite';
import { Calendar } from './Calendar';
import React from 'react';
import { TodayBlocks, useTodayStore } from '../store';

export const CalendarBlock = observer(function CalendarBlock() {
  const store = useTodayStore();

  return (
    <Calendar
      instance={store.calendar}
      isHotkeysEnabled={store.focusedBlock === TodayBlocks.CALENDAR}
      tasks={store.allTasks}
      dropItem={store.draggingTask}
      isCollapsed={!store.isCalendarExpanded}
      isFullScreen={store.isCalendarFullScreen}
      callbacks={store.calendarCallbacks}
      focusHighlightParams={{
        condition: !store.isCalendarFullScreen && store.isCalendarExpanded && (
          store.currentFocusedBlock === TodayBlocks.CALENDAR ||
          store.lastOpenedBlock === TodayBlocks.CALENDAR
        ),
        deps: [store.currentFocusedBlock, store.lastOpenedBlock]
      }}
    />
  );
});
