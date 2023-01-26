import React from 'react';
import {
  Box,
  Heading,
  HStack,
  Button,
  IconButton,
  ButtonGroup,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDownLeftAndArrowUpRightToCenter,
  faArrowUpRightAndArrowDownLeftFromCenter,
} from '@fortawesome/pro-solid-svg-icons';
import { TooltipWithHotkey } from '../../../../../shared/TooltipWithHotkey';
import { ExpandIcon } from '../../../../../shared/Icons/ExpandIcon';
import { CalendarStore } from '../store';

export const CalendarToolbar = ({ today, isFullScreen, callbacks, setResolution, daysCount }: CalendarStore) => (
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
        {today.toLocaleDateString('en', {
          year: 'numeric',
          month: 'long',
        })}
      </Heading>
    </Box>
    <Box>
      {!isFullScreen && (<TooltipWithHotkey label='Expand calendar' hotkey='⌘E' hasArrow>
        <IconButton
          aria-label={'full screen'}
          size='xs'
          variant='ghost'
          onClick={callbacks.onOpenFullScreen}
          mr={2}
        >
          <FontAwesomeIcon
            fontSize={16}
            color={`var(--chakra-colors-gray-400)`}
            icon={faArrowUpRightAndArrowDownLeftFromCenter}
            fixedWidth
          />
        </IconButton>
      </TooltipWithHotkey>
      )}
      {isFullScreen && (
        <TooltipWithHotkey label='Collapse calendar' hotkey='⌘E' hasArrow>
          <IconButton
            aria-label={'collapse'}
            size='xs'
            variant='ghost'
            onClick={callbacks.onCloseFullScreen}
            mr={2}
          >
            <FontAwesomeIcon
              fontSize={16}
              color={`var(--chakra-colors-gray-400)`}
              icon={faArrowDownLeftAndArrowUpRightToCenter}
              fixedWidth
            />
          </IconButton>
        </TooltipWithHotkey>
      )}
      <ButtonGroup size='xs' bg='gray.75' p={1} borderRadius='md'>
        <Button
          onClick={() => setResolution(1)}
          bg={daysCount === 1 ? 'gray.200' : 'gray.75'}
        >
          Day
        </Button>
        <Button
          onClick={() => setResolution(3)}
          bg={daysCount === 3 ? 'gray.200' : 'gray.75'}
        >
          3 days
        </Button>
        <Button
          onClick={() => setResolution(7)}
          bg={daysCount === 7 ? 'gray.200' : 'gray.75'}
        >
          Week
        </Button>
      </ButtonGroup>
      <Button
        ml={4}
        size='sm'
        variant='ghost'
        onClick={callbacks.onCollapse}
        p={1}
      >
        <TooltipWithHotkey label='Hide calendar' hotkey='Press C' hasArrow>
          <IconButton
            aria-label={'hide'}
            size='xs'
            variant='ghost'
          >
            <ExpandIcon />
          </IconButton>
        </TooltipWithHotkey>
      </Button>
    </Box>
  </HStack>
);
