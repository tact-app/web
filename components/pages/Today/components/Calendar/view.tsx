import { observer } from 'mobx-react-lite';
import { useCalendarStore } from './store';
import {
  Box,
  Button,
  Fade,
  Text,
  IconButton,
  useOutsideClick,
} from '@chakra-ui/react';
import { CalendarTableColumn } from './CalendarTableColumn';
import { CalendarTableTimes } from './CalendarTableTimes';
import { CalendarTableHeader } from './CalendarTableHeader';
import { ExpandIcon } from '../../../../shared/Icons/ExpandIcon';
import { ResizableBlocks } from './ResizableBlocks';
import { CalendarTableEvent } from './CalendarTableEvent';
import { useRef } from 'react';
import { CalendarToolbar } from './CalendarToolbar/CalendarToolbar';
import { TooltipWithHotkey } from '../../../../shared/TooltipWithHotkey';

export const CalendarView = observer(function CalendarView() {
  const store = useCalendarStore();
  const ref = useRef();

  useOutsideClick({
    ref,
    enabled: !store.isCollapsed,
    handler: store.handleOutsideClick,
  });

  return (
    <Box
      pt={store.isCollapsed ? 0 : 10}
      pl={store.isCollapsed ? 0 : 6}
      pr={store.isCollapsed ? 0 : 4}
      display='flex'
      flexDirection='column'
      h='100%'
      borderLeft='1px solid var(--chakra-colors-gray-200)'
    >
      {store.isCollapsed ? (
        <Button
          onClick={store.callbacks.onExpand}
          variant='unstyled'
          p={3}
          pt={10}
          h='100%'
          display='flex'
          justifyContent='flex-start'
          flexDirection='column'
          alignItems='end'
        >
          <Box display='flex' justifyContent='center' w={8}>
            <Fade in={true}>
              <TooltipWithHotkey label='Show calendar' hotkey='Press C' hasArrow>
                <IconButton
                  aria-label={'Show'}
                  size='xs'
                  variant='ghost'
                >
                  <ExpandIcon left />
                </IconButton>
              </TooltipWithHotkey>
              <Text
                mt={6}
                color='gray.400'
                transform='rotate(-180deg)'
                h='auto'
                style={{
                  writingMode: 'vertical-rl',
                }}
                cursor='pointer'
                fontSize='2xl'
                fontWeight='semibold'
              >
                Calendar
              </Text>
            </Fade>
          </Box>
        </Button>
      ) : (
        <Box h='100%' display='flex' flexDirection='column'>
          <CalendarToolbar {...store} />
          <CalendarTableHeader />
          <ResizableBlocks
            instance={store.resizeBlocks}
            grid={store.dayGridStep}
            minValue={store.dayStartTime}
            maxValue={store.dayEndTime}
            block={CalendarTableEvent}
            callbacks={store.resizableBlocksCallbacks}
            isHotkeysEnabled={!store.root.isModalOpen}
          >
            <Box display='flex' position='relative' w='100%' h='fit-content'>
              <CalendarTableTimes />
              {store.days.map((day) => (
                <CalendarTableColumn key={day.id} day={day} />
              ))}
            </Box>
          </ResizableBlocks>
        </Box>
      )}
    </Box>
  );
});
