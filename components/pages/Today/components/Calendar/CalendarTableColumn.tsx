import { observer } from 'mobx-react-lite';
import { chakra } from '@chakra-ui/react';
import { useCalendarStore } from './store';
import { ResizableBlocksContainer } from './ResizableBlocks/ResizableBlocksContainer';
import { DayData } from './types';

export const CalendarTableColumn = observer(function CalendarTableColumn({
  day,
}: {
  day: DayData;
}) {
  const store = useCalendarStore();

  return (
    <chakra.div
      position='relative'
      h='auto'
      overflow='hidden'
      borderLeft='1px solid var(--chakra-colors-gray-200)'
      flex={day.id === store.todayId && store.daysCount <= 3 ? 2 : 1}
    >
      <ResizableBlocksContainer id={day.id} from={day.from} to={day.to} />
    </chakra.div>
  );
});
