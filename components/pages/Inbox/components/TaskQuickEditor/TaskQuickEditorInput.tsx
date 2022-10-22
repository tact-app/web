import { observer } from 'mobx-react-lite';
import { useTaskQuickEditorStore } from './store';
import { chakra, HStack, Input, Text } from '@chakra-ui/react';
import React from 'react';
import { TaskQuickEditorMenu } from './TaskQuickEditorMenu';
import { TaskPriorityArray, TaskPriorityNames } from '../../types';
import { TaskPriorityIcon } from '../../../../shared/Icons/TaskPriorityIcon';

export const TaskQuickEditorInput = observer(function TaskQuickEditInput({
  placeholder,
  autofocus,
}: {
  placeholder?: string;
  autofocus?: boolean;
}) {
  const store = useTaskQuickEditorStore();

  let items = [];

  if (store.tagActive) {
    const hasCreateNewTag =
      store.currentTagValue.length > 1 && !store.currentTagMatch;

    items = store.filteredAvailableTags.map(({ title }) => <>{title}</>);

    if (hasCreateNewTag) {
      items.unshift(
        // eslint-disable-next-line react/no-unescaped-entities
        <>Tag not found. Create new "{store.currentTagValue.slice(1)}" tag</>
      );
    }
  }

  if (store.priorityActive) {
    items = TaskPriorityArray.map((key) => (
      <HStack key={key} justifyContent='space-between' w='100%'>
        <Text>{TaskPriorityNames[key]}</Text>
        <TaskPriorityIcon priority={key} />
      </HStack>
    ));
  }

  return (
    <>
      <Input
        size='md'
        autoFocus={autofocus}
        variant='unstyled'
        placeholder={placeholder}
        value={store.value}
        onChange={store.handleChange}
        onFocus={store.handleFocus}
        onBlur={store.removeInputFocus}
        onKeyDown={store.handleKeyDown}
        ref={store.inputRef}
      />
      <chakra.div position='absolute'>
        <chakra.span visibility='hidden'>
          {store.value.slice(
            0,
            store.value.length - store.currentTagValue.length
          )}
        </chakra.span>
        <TaskQuickEditorMenu items={items} />
      </chakra.div>
    </>
  );
});
