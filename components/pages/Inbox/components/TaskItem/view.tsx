import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Checkbox, HStack, Text, chakra, Tag } from '@chakra-ui/react';
import { TaskStatus } from '../../types';
import { useTaskItemStore } from './store';
import { TaskPriorityIcon } from '../../../../shared/Icons/TaskPriorityIcon';
import { TaskItemMenu } from '../TaskItemMenu';
import { TaskQuickEditorInput } from '../TaskQuickEditor/TaskQuickEditorInput';
import { TaskQuickEditorTags } from '../TaskQuickEditor/TaskQuickEditorTags';
import { TaskQuickEditorPriority } from '../TaskQuickEditor/TaskQuickEditorPriority';
import { useTaskQuickEditorStore } from '../TaskQuickEditor/store';

export const TaskItemView = observer(function TaskItem() {
  const store = useTaskItemStore();
  const quickEditStore = useTaskQuickEditorStore();
  const isTodoTask = store.task.status === TaskStatus.TODO;

  return (
    <Box display='flex' flex={1}>
      <Box flex={1} ml={2} bg='white'
           borderBottom={store.isDragging || store.isFocused ? '1px solid transparent' : '1px solid var(--chakra-colors-gray-100)'}
           transition='border-color 0.2s ease-in-out'
           _groupHover={store.isFocused || store.isDragging ? {} : {
             borderBottom: '1px solid transparent',
           }}
           onClick={store.handleClick}
      >
        <Box
          transition='background 0.2s ease-in-out'
          bg={store.isFocused ? 'gray.200' : store.isDragging ? 'gray.50' : 'white'}
          _groupHover={store.isFocused || store.isDragging ? {} : {
            bg: 'gray.50',
          }}
        >
          <Box h={10} pl={2} display='flex' alignItems='center'>
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                bg='white' size='lg' mr={2}
                isChecked={store.task.status === TaskStatus.DONE}
                isIndeterminate={store.task.status === TaskStatus.WONT_DO}
                onChange={store.handleStatusChange}
                name='task-status'
              />
            </div>
            {store.isEditMode && isTodoTask ? (
              <TaskQuickEditorInput autofocus/>
            ) : (
              <Box position='relative'>
                <Text
                  transition='color 0.2s ease-in-out'
                  color={isTodoTask ? 'gray.700' : 'gray.400'}
                >
                  {store.task.title}
                </Text>
                <chakra.div h='1px' bg='gray.400' bottom='0.675rem'
                            transition='width 0.2s ease-in-out'
                            position='absolute'
                            w={isTodoTask ? 0 : '100%'}
                />
              </Box>
            )}
            <chakra.div justifySelf='end' ml='auto' mr={4}>
              {store.isEditMode ? (
                <TaskQuickEditorPriority/>
              ) : (
                <TaskPriorityIcon priority={store.task.priority}/>
              )}
            </chakra.div>
          </Box>
          {
            store.isEditMode ? (
              !!quickEditStore.tags.length && (
                <HStack ml={9} pb={2.5} maxH='34px'>
                  <TaskQuickEditorTags/>
                </HStack>
              )
            ) : (
              !!store.task.tags.length && (
                <HStack ml={9} pb={2.5}>
                  {
                    store.task.tags.map((id) => (
                      <Tag bg='blue.400' color='white' cursor='pointer' key={id}>
                        {store.tags[id]?.title}
                      </Tag>
                    ))
                  }
                </HStack>
              )
            )
          }
        </Box>
      </Box>
      <TaskItemMenu/>
    </Box>
  );
});
