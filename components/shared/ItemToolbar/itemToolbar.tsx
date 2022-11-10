import { Box, chakra, CloseButton, IconButton } from '@chakra-ui/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDownLeftAndArrowUpRightToCenter,
  faArrowUpRightAndArrowDownLeftFromCenter,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/pro-solid-svg-icons';

export const ItemToolbar = (props: {
  isExpanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
  onPreviousItem?: () => void;
  onNextItem?: () => void;
  onClose?: () => void;
}) => (
  <Box
    pl={0}
    pr={0}
    pb={2}
    borderBottomWidth='1px'
    display='flex'
    justifyContent='space-between'
    alignItems='center'
  >
    <Box display='flex' alignItems='center'>
      {props.onExpand && !props.isExpanded && (
        <IconButton
          aria-label={'expand'}
          size='xs'
          variant='ghost'
          onClick={props.onExpand}
          mr={2}
        >
          <FontAwesomeIcon
            fontSize={16}
            color={`var(--chakra-colors-gray-400)`}
            icon={faArrowUpRightAndArrowDownLeftFromCenter}
            fixedWidth
          />
        </IconButton>
      )}
      {props.onCollapse && props.isExpanded && (
        <IconButton
          aria-label={'collapse'}
          size='xs'
          variant='ghost'
          onClick={props.onCollapse}
          mr={2}
        >
          <FontAwesomeIcon
            fontSize={16}
            color={`var(--chakra-colors-gray-400)`}
            icon={faArrowDownLeftAndArrowUpRightToCenter}
            fixedWidth
          />
        </IconButton>
      )}
      {(props.onCollapse || props.onExpand) && (
        <chakra.div h={4} bg='gray.200' w={0.5} display='inline-block' mr={2} />
      )}
      {(props.onPreviousItem || props.onNextItem) && (
        <>
          <IconButton
            aria-label={'prev'}
            size='xs'
            variant='ghost'
            mr={2}
            onClick={props.onPreviousItem}
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
            variant='ghost'
            onClick={props.onNextItem}
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
    <CloseButton onClick={props.onClose} color='gray.400' size='sm' />
  </Box>
);
