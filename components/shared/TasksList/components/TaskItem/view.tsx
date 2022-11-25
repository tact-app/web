import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Checkbox, chakra, Tag, useOutsideClick } from '@chakra-ui/react';
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
    enabled: store.isEditMode || store.quickEdit.isMenuFocused,
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
        tabIndex={store.isDisabled || store.isReadOnly ? -1 : 0}
        ref={store.setBoxRef}
        onClick={store.handleClick}
        onMouseDown={store.handleMouseDown}
        onMouseUp={store.handleMouseUp}
        onFocus={store.handleFocus}
        _focus={{
          outline: 'none',
        }}
        flex={1}
        overflow='hidden'
        borderBottom='1px'
        borderColor={
          props.highlightActiveTasks && !store.isDisabled
            ? 'transparent'
            : 'gray.100'
        }
        transition={[
          'border-color 0.2s ease-in-out',
          'background 0.2s ease-in-out',
        ]}
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
              pointerEvents={
                store.isReadOnly || store.isDisabled ? 'none' : 'auto'
              }
              variant='indeterminateUnfilled'
              bg='white'
              size='lg'
              mr={2}
              isFocusable={false}
              tabIndex={-1}
              isChecked={store.task.status === TaskStatus.DONE}
              isIndeterminate={store.task.status === TaskStatus.WONT_DO}
              onChange={store.handleStatusChange}
              name='task-status'
            />
          </div>
          {store.isEditMode ? (
            <TaskQuickEditorInput autoFocus />
          ) : (
            <Box position='relative' overflow='hidden'>
              <chakra.span
                transition='color 0.2s ease-in-out'
                color={
                  isTodoTask && !store.isEditMode ? 'gray.700' : 'gray.400'
                }
                whiteSpace='nowrap'
                textOverflow='ellipsis'
                overflow='hidden'
              >
                {store.task.title}
              </chakra.span>
              <chakra.div
                h='1px'
                bg='gray.400'
                bottom='0.5rem'
                transition='width 0.2s ease-in-out'
                position='absolute'
                w={isTodoTask && !store.isEditMode ? 0 : '100%'}
              />
            </Box>
          )}
          <chakra.div justifySelf='end' ml='auto' mr={4}>
            <TaskQuickEditorPriority
              disabled={store.isDisabled || store.isReadOnly}
            />
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
      {!store.isReadOnly && !store.isDisabled && <TaskItemMenu />}
    </Box>
  );
});
