import { observer } from 'mobx-react-lite';
import { CalendarProps, useCalendarStore } from './store';
import {
  Box,
  Button,
  ButtonGroup,
  Fade,
  Heading,
  HStack,
  Text,
} from '@chakra-ui/react';
import { CalendarTableColumn } from './CalendarTableColumn';
import { CalendarTableTimes } from './CalendarTableTimes';
import { CalendarTableHeader } from './CalendarTableHeader';
import { ExpandIcon } from '../../../../shared/Icons/ExpandIcon';
import { ResizableBlocks } from './ResizableBlocks';

export const CalendarView = observer(function CalendarView(
  props: CalendarProps
) {
  const store = useCalendarStore();

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
          onClick={props.callbacks.onExpand}
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
              <ExpandIcon left={true} />
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
          <HStack justifyContent='space-between'>
            <Box display='flex' alignItems='center'>
              <Heading fontSize='2xl' fontWeight='semibold'>
                Calendar
              </Heading>
              <Heading
                fontSize='lg'
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
            <Box>
              <ButtonGroup size='xs' bg='gray.75' p={1} borderRadius='md'>
                <Button
                  onClick={() => store.setResolution(1)}
                  bg={store.daysCount === 1 ? 'gray.200' : 'gray.75'}
                >
                  Day
                </Button>
                <Button
                  onClick={() => store.setResolution(3)}
                  bg={store.daysCount === 3 ? 'gray.200' : 'gray.75'}
                >
                  3 days
                </Button>
                <Button
                  onClick={() => store.setResolution(7)}
                  bg={store.daysCount === 7 ? 'gray.200' : 'gray.75'}
                >
                  Week
                </Button>
              </ButtonGroup>
              <Button
                ml={4}
                size='sm'
                variant='ghost'
                onClick={props.callbacks.onCollapse}
                p={1}
              >
                <ExpandIcon />
              </Button>
            </Box>
          </HStack>
          <CalendarTableHeader />
          <ResizableBlocks
            items={store.resizableEvents}
            grid={store.dayGridStep}
            minValue={store.dayStartTime}
            maxValue={store.dayEndTime}
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
