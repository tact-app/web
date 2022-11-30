import { observer } from 'mobx-react-lite';
import { Box, chakra, Fade } from '@chakra-ui/react';
import { DraggableListDroppable } from '../../../shared/DraggableList/view';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarLines } from '@fortawesome/pro-light-svg-icons';
import React, { PropsWithChildren } from 'react';

export const TasksDroppablePlaceholder = observer(
  function TasksDroppablePlaceholder(
    props: PropsWithChildren<{ in: boolean; id: string }>
  ) {
    return (
      <Fade in={props.in}>
        <DraggableListDroppable
          id={props.id}
          pr={5}
          pl={5}
          position='relative'
          hidePlaceholder
        >
          <Box
            color='gray.400'
            minH={12}
            w='100%'
            borderRadius='lg'
            bg='gray.75'
            display='flex'
            justifyContent='center'
            alignItems='center'
          >
            <FontAwesomeIcon icon={faCalendarLines} />
            <chakra.span ml={2.5}>{props.children}</chakra.span>
          </Box>
        </DraggableListDroppable>
      </Fade>
    );
  }
);
