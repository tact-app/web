import {
  Button,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  chakra,
} from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';
import {
  TaskPriority,
  TaskPriorityArray,
  TaskPriorityNames,
} from '../../types';
import { TaskPriorityIcon } from '../../../../shared/Icons/TaskPriorityIcon';

export const TaskPriorityMenu = observer(function TaskPriorityMenu({
  isOpen,
  onFocus,
  onSelect,
  children,
  itemRef,
  hoveredItemIndex,
  ...rest
}: PropsWithChildren<{
  isOpen?: boolean;
  onFocus?: () => void;
  onSelect: (priority: TaskPriority) => void;
  itemRef?: (el: HTMLButtonElement) => void;
  hoveredItemIndex?: number;
}>) {
  return (
    <Popover
      isOpen={isOpen}
      placement='bottom-start'
      offset={[0, 24]}
      {...rest}
    >
      {children ? (
        <PopoverTrigger>{children}</PopoverTrigger>
      ) : (
        <PopoverTrigger>
          <chakra.span />
        </PopoverTrigger>
      )}
      <Portal>
        <PopoverContent
          p={0}
          boxShadow='lg'
          onFocus={onFocus}
          w={32}
          minW={32}
          overflow='hidden'
        >
          <PopoverBody p={0}>
            {TaskPriorityArray.map((key, index) => (
              <Button
                variant='ghost'
                size='sm'
                borderRadius={0}
                w='100%'
                key={key}
                fontSize='sm'
                lineHeight='5'
                fontWeight='normal'
                onClick={() => onSelect(key)}
                bg={hoveredItemIndex === index ? 'gray.100' : 'white'}
                ref={
                  itemRef && hoveredItemIndex === index
                    ? (el) => itemRef(el)
                    : undefined
                }
              >
                <HStack justifyContent='space-between' w='100%'>
                  <Text>{TaskPriorityNames[key]}</Text>
                  <TaskPriorityIcon priority={key} />
                </HStack>
              </Button>
            ))}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
});
