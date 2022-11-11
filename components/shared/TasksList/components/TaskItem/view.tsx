import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Checkbox,
  Text,
  chakra,
  Tag,
  useOutsideClick,
} from '@chakra-ui/react';
import { TaskStatus } from '../../types';
import { TaskItemProps, useTaskItemStore } from './store';
import { TaskItemMenu } from '../TaskItemMenu';
import { TaskQuickEditorInput } from '../TaskQuickEditor/TaskQuickEditorInput';
import { TaskQuickEditorTags } from '../TaskQuickEditor/TaskQuickEditorTags';
import { TaskQuickEditorPriority } from '../TaskQuickEditor/TaskQuickEditorPriority';
import { useTaskQuickEditorStore } from '../TaskQuickEditor/store';

export const TaskItemView = observer(function TaskItem(props: TaskItemProps) {
  const store = useTaskItemStore();
  const quickEditStore = useTaskQuickEditorStore();
  const isTodoTask = store.task.status === TaskStatus.TODO;
  const ref = useRef(null);
  const hasTags = Boolean(
    store.isEditMode
      ? quickEditStore.modes.tag.tags.length
      : store.task.tags.length
  );

  let bg = 'white';
  let hoveredBg = 'white';
  let focusedBg = 'white';

  if (props.highlightActiveTasks) {
    if (!store.isDisabled) {
      bg = 'blue.25';
      hoveredBg = 'blue.50';
      focusedBg = 'blue.100';
    }
  } else {
    if (!store.isDragging) {
      bg = 'white';
      hoveredBg = 'gray.100';
      focusedBg = 'gray.200';
    }
  }

  useOutsideClick({
    ref: ref,
    handler: quickEditStore.handleClickOutside,
  });

  return (
    <Box
      ref={ref}
      flex={1}
      display='flex'
      transition={['filter 0.2s ease-in-out', 'opacity 0.2s ease-in-out']}
      filter={store.isDisabled ? 'grayscale(1)' : 'grayscale(0)'}
      opacity={store.isDisabled ? 0.2 : 1}
      pointerEvents={store.isDisabled ? 'none' : 'auto'}
    >
      <Box
        flex={1}
        borderBottom='1px'
        overflow='hidden'
        borderColor={
          props.highlightActiveTasks && !store.isDisabled
            ? 'transparent'
            : 'gray.100'
        }
        transition={[
          'border-color 0.2s ease-in-out',
          'background 0.2s ease-in-out',
        ]}
        onClick={store.handleClick}
        bg={store.isFocused ? focusedBg : bg}
        _groupHover={{
          bg: store.isFocused ? focusedBg : hoveredBg,
          borderColor:
            props.highlightActiveTasks && !store.isDisabled
              ? 'transparent'
              : 'gray.100',
        }}
      >
        <Box minH={10} pl={2} display='flex' alignItems='center'>
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              pointerEvents={store.isReadOnly ? 'none' : 'auto'}
              variant='indeterminateUnfilled'
              bg='white'
              size='lg'
              mr={2}
              isChecked={store.task.status === TaskStatus.DONE}
              isIndeterminate={store.task.status === TaskStatus.WONT_DO}
              onChange={store.handleStatusChange}
              name='task-status'
            />
          </div>
          {store.isEditMode && isTodoTask ? (
            <TaskQuickEditorInput autofocus />
          ) : (
            <Box position='relative' overflow='hidden'>
              <Text
                transition='color 0.2s ease-in-out'
                color={isTodoTask ? 'gray.700' : 'gray.400'}
                whiteSpace='nowrap'
                textOverflow='ellipsis'
                overflow='hidden'
              >
                {store.task.title}
              </Text>
              <chakra.div
                h='1px'
                bg='gray.400'
                bottom='0.675rem'
                transition='width 0.2s ease-in-out'
                position='absolute'
                w={isTodoTask ? 0 : '100%'}
              />
            </Box>
          )}
          <chakra.div justifySelf='end' ml='auto' mr={4}>
            <TaskQuickEditorPriority />
          </chakra.div>
        </Box>
        {hasTags && (
          <Box
            overflow='auto'
            display='flex'
            ml={8}
            mr={5}
            pb={2.5}
            pr={2}
            pt={1}
            pl={1}
            css={{
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {store.isEditMode ? (
              <TaskQuickEditorTags />
            ) : (
              store.task.tags.map((id) => (
                <Tag
                  bg='blue.400'
                  color='white'
                  cursor='pointer'
                  key={id}
                  flexShrink={0}
                  mr={2}
                >
                  {store.tags[id]?.title}
                </Tag>
              ))
            )}
          </Box>
        )}
      </Box>
      {!store.isReadOnly && <TaskItemMenu />}
    </Box>
  );
});
