import { observer } from 'mobx-react-lite';
import { chakra } from '@chakra-ui/react';
import { useCalendarStore } from './store';
import { ResizableBlocksContainer } from './ResizableBlocks/ResizableBlocksContainer';

export const CalendarTableColumn = observer(
  function CalendarTableColumn(props: { dayId: string }) {
    const store = useCalendarStore();

    return (
      <chakra.div
        position='relative'
        h='auto'
        overflow='hidden'
        borderLeft='1px solid var(--chakra-colors-gray-200)'
        flex={props.dayId === store.todayId && store.daysCount <= 3 ? 2 : 1}
      >
        <ResizableBlocksContainer id={props.dayId} />
      </chakra.div>
    );
  }
);
