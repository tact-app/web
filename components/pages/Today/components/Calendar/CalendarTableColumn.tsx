import { observer } from 'mobx-react-lite';
import { chakra, HTMLChakraProps } from '@chakra-ui/react';
import { useCalendarStore } from './store';
import { EventData } from './types';
import { Rnd } from 'react-rnd';

const CalendarTableColumnEvent = observer(function CalendarTableColumnEvent({
  event,
  day,
}: {
  event: EventData;
  day: number;
}) {
  const store = useCalendarStore();
  const height =
    store.castTimeToOffset(event.end) - store.castTimeToOffset(event.start);

  const defaultPosition = store.castTimeToOffset(event.start);
  const position =
    store.isResizeActive &&
    store.resizedEventId === event.id &&
    store.resizeDirection === 'top'
      ? defaultPosition - store.resizeDelta
      : defaultPosition;

  return (
    <Rnd
      size={{ height, width: '100%' }}
      position={{ x: 0, y: position }}
      resizeGrid={store.grid}
      dragGrid={store.grid}
      style={{
        background: 'var(--chakra-colors-blue-100)',
        width: '100%',
      }}
      minHeight={store.grid[1]}
      dragAxis='none'
      bounds='parent'
      enableResizing={{
        top: true,
        right: false,
        bottom: true,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      onResizeStop={(e, direction, ref, d) => {
        store.endResize(event, direction, d.height);
      }}
      onResize={(e, direction, ref, d) => {
        store.resize(d.height);
      }}
      onDrag={console.log}
      onResizeStart={(e, direction) => store.startResize(event, direction)}
      onDragStop={(e, d) => {
        store.endDragging(event, d.y);
      }}
      onDragStart={(e, d) => {
        store.startDragging(event, (e as MouseEvent).clientY);
      }}
    >
      {event.title}
    </Rnd>
  );
});

export const CalendarTableColumn = observer(function CalendarTableColumn(
  props: HTMLChakraProps<'div'> & { index: number; viewIndex: number }
) {
  const store = useCalendarStore();

  return (
    <chakra.div
      position='relative'
      flex={props.index === 0 && store.daysCount <= 3 ? 2 : 1}
      ref={(el) => store.setDayRef(props.viewIndex, el)}
      onMouseDown={(e) => store.handleColumnMouseDown(props.index, e)}
      {...props}
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
      <chakra.div h='100%' overflow='hidden' position='relative'>
        {store.ghostEvent && store.ghostEvent.dayIndex === props.index ? (
          <CalendarTableColumnEvent
            event={store.ghostEvent}
            day={props.index}
          />
        ) : null}
        {store.events[props.index] &&
          store.events[props.index].map((event) => (
            <CalendarTableColumnEvent
              key={event.id}
              event={event}
              day={props.index}
            />
          ))}
      </chakra.div>
    </chakra.div>
  );
});
