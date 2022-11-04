import { Box, chakra, CloseButton, IconButton } from '@chakra-ui/react';
import { ExpandLayoutIcon } from '../Icons/ExpandLayoutIcon';
import { SideLayoutIcon } from '../Icons/SideLayoutIcon';
import { ArrowDownIcon, ArrowUpIcon } from '../Icons/ArrowIcons';
import React from 'react';

export const ItemToolbar = (props: {
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
      {props.onExpand && (
        <IconButton
          aria-label={'expand'}
          size='xs'
          variant='ghost'
          onClick={props.onExpand}
          mr={2}
        >
          <ExpandLayoutIcon />
        </IconButton>
      )}
      {props.onCollapse && (
        <IconButton
          aria-label={'expand'}
          size='xs'
          variant='ghost'
          onClick={props.onCollapse}
          mr={2}
        >
          <SideLayoutIcon />
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
            <ArrowUpIcon />
          </IconButton>
          <IconButton
            aria-label={'next'}
            size='xs'
            variant='ghost'
            onClick={props.onNextItem}
          >
            <ArrowDownIcon />
          </IconButton>
        </>
      )}
    </Box>
    <CloseButton onClick={props.onClose} color='gray.400' size='sm' />
  </Box>
);
