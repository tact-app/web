import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Checkbox, HStack, Input, Text, chakra, Tag } from '@chakra-ui/react';
import { TaskStatus } from '../../store/types';
import { useTaskItemStore } from './store';
import { TaskPriorityIcon } from '../TaskIcons/TaskPriorityIcon';

export const TaskItemView = observer(function TaskItem() {
  const store = useTaskItemStore();
  const ref = useRef(null);
  const isTodoTask = store.task.status === TaskStatus.TODO;

  return (
    <Box
      borderBottom='1px solid var(--chakra-colors-gray-200)'
      bg='white'
      transition='border-color 0.2s ease-in-out'
      _hover={{
        borderBottom: '1px solid transparent',
      }}
      _focus={{
        borderBottom: '1px solid transparent',
      }}
    >
      <Box
        transition='background 0.2s ease-in-out'
        _hover={{
          bg: 'gray.50',
          borderRadius: 4,
        }}
        _focus={{
          bg: 'gray.100',
          borderRadius: 4,
        }}
      >
        <Box
          onClick={store.focus}
          h={10}
          pl={2}
          pr={2}
          display='flex'
          alignItems='center'
        >
          <Checkbox
            bg='white'
            size='lg'
            mr={2}
            isChecked={store.task.status === TaskStatus.DONE}
            isIndeterminate={store.task.status === TaskStatus.WONT_DO}
            onChange={store.handleStatusChange}
          />
          {store.isFocused && isTodoTask ? (
            <Input
              ref={ref}
              autoFocus={true}
              value={store.task.title}
              onKeyDown={store.handleKeyDown}
              variant='unstyled'
            />
          ) : (
            <Box position='relative'>
              <Text
                transition='color 0.2s ease-in-out'
                color={isTodoTask ? 'gray.700' : 'gray.400'}
              >
                {store.task.title}
              </Text>
              <chakra.div
                transition='width 0.2s ease-in-out'
                position='absolute'
                h='1px'
                bg='gray.400'
                bottom='0.675rem'
                w={isTodoTask ? 0 : '100%'}
              />
            </Box>
          )}
          <chakra.div justifySelf='end' ml='auto'>
            <TaskPriorityIcon priority={store.task.priority}/>
          </chakra.div>
        </Box>
        {
          !!store.task.tags.length && (
            <HStack ml={9} pb={2.5}>
              {
                store.task.tags.map((id) => (
                  <Tag
                    bg='blue.400'
                    color='white'
                    cursor='pointer'
                  >
                    {store.tags[id]?.title}
                  </Tag>
                ))
              }
            </HStack>
          )
        }
      </Box>
    </Box>
  );
});
