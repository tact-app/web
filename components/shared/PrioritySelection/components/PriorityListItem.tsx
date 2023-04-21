import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  chakra,
  Checkbox,
  ListItem,
  forwardRef,
} from '@chakra-ui/react';
import { usePrioritySelectionStore } from '../store';
import { TaskPriority, TaskPriorityNames } from '../../TasksList/types';
import { TaskPriorityIcon } from '../../Icons/TaskPriorityIcon';

type PriorityListItemProps = {
  priority: TaskPriority;
  checkboxContent?: React.ReactNode;
};

export const PriorityListItem = observer(
  forwardRef(function PriorityListItem(
    { priority, checkboxContent }: PriorityListItemProps,
    ref
  ) {
    const store = usePrioritySelectionStore();

    return (
      <ListItem
        h={10}
        display='flex'
        alignItems='center'
        borderBottom='1px'
        borderColor='gray.100'
        key={priority}
      >
        <Checkbox
          ref={ref}
          isChecked={!!store.checkedPriority[priority]}
          onChange={() => store.handlePriorityCheck(priority)}
          size='xl'
          position='relative'
          fontWeight='semibold'
          fontSize='lg'
          width='100%'
          icon={checkboxContent ? <></> : undefined}
          css={{
            '.chakra-checkbox__label': {
              width: 'calc(100% - 2rem)',
            }
          }}
        >
          {checkboxContent ? (
            <chakra.span
              position='absolute'
              left={0}
              w={6}
              top={0}
              bottom={0}
              display='flex'
              alignItems='center'
              justifyContent='center'
              color={store.checkedPriority[priority] ? 'white' : 'gray.400'}
            >
              {checkboxContent}
            </chakra.span>
          ) : null}
          <chakra.span
            display='flex'
            alignItems='center'
            fontSize='sm'
            fontWeight='normal'
          >
            <chakra.div
              pt={1}
              pb={1}
              w='100%'
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <chakra.span display='flex' alignItems='center'>
                <TaskPriorityIcon priority={priority} />
                <chakra.span ml={3} mr={3} overflow='hidden' textOverflow='ellipsis'>
                  {TaskPriorityNames[priority]}
                </chakra.span>
              </chakra.span>
            </chakra.div>
          </chakra.span>
        </Checkbox>
      </ListItem>
    );
  })
);
