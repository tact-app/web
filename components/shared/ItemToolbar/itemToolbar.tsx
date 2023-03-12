import {
  Box,
  BoxProps,
  chakra,
  CloseButton,
  IconButton,
} from '@chakra-ui/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDownLeftAndArrowUpRightToCenter,
  faArrowUpRightAndArrowDownLeftFromCenter,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/pro-solid-svg-icons';
import { TooltipWithHotkey } from '../TooltipWithHotkey';

export const ItemToolbar = ({
  isExpanded,
  hasPreviousItem = true,
  hasNextItem = true,
  onExpand,
  onCollapse,
  onPreviousItem,
  onNextItem,
  onClose,
  ...rest
}: {
  isExpanded?: boolean;
  hasPreviousItem?: boolean;
  hasNextItem?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
  onPreviousItem?: () => void;
  onNextItem?: () => void;
  onClose?: () => void;
} & BoxProps) => (
  <Box
    pl={0}
    pr={0}
    pb={2}
    borderBottomWidth='1px'
    display='flex'
    justifyContent='space-between'
    alignItems='center'
    {...rest}
  >
    <Box display='flex' alignItems='center' onMouseDown={(e) => e.stopPropagation()}>
      {onExpand && !isExpanded && (
        <TooltipWithHotkey label='Expand' hotkey='⌘+E' hasArrow>
          <IconButton
            aria-label={'expand'}
            size='xs'
            variant='ghost'
            onClick={onExpand}
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
      {onCollapse && isExpanded && (
        <TooltipWithHotkey label='Collapse' hotkey='⌘+E' hasArrow>
          <IconButton
            aria-label={'collapse'}
            size='xs'
            variant='ghost'
            onClick={onCollapse}
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
      {(onCollapse || onExpand) && (
        <chakra.div h={4} bg='gray.200' w={0.5} display='inline-block' mr={2} />
      )}
      {(onPreviousItem || onNextItem) && (
        <>
          <IconButton
            aria-label={'prev'}
            size='xs'
            isDisabled={!hasPreviousItem}
            variant='ghost'
            mr={2}
            onClick={onPreviousItem}
          >
            <FontAwesomeIcon
              fontSize={16}
              color={`var(--chakra-colors-gray-400)`}
              icon={faChevronUp}
              fixedWidth
            />
          </IconButton>
          <IconButton
            aria-label={'next'}
            size='xs'
            isDisabled={!hasNextItem}
            variant='ghost'
            onClick={onNextItem}
          >
            <FontAwesomeIcon
              fontSize={16}
              color={`var(--chakra-colors-gray-400)`}
              icon={faChevronDown}
              fixedWidth
            />
          </IconButton>
        </>
      )}
    </Box>
    <CloseButton onClick={onClose} color='gray.400' size='sm' />
  </Box>
);
