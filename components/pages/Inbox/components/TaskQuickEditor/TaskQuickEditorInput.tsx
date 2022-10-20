import { observer } from 'mobx-react-lite';
import { useTaskQuickEditorStore } from './store';
import { chakra, Input } from '@chakra-ui/react';
import { TaskQuickEditorTagsMenu } from './TaskQuickEditorTagsMenu';
import { TaskPriorityMenu } from '../TaskPriorityMenu';
import React from 'react';

export const TaskQuickEditorInput = observer(function TaskQuickEditInput({
                                                                           placeholder,
                                                                           autofocus
                                                                         }: {
  placeholder?: string,
  autofocus?: boolean
}) {
  const store = useTaskQuickEditorStore();

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
        onBlur={store.removeFocus}
        onKeyDown={store.handleKeyDown}
        ref={store.inputRef}
      />
      <chakra.div position='absolute'>
        <chakra.span visibility='hidden'>
          {store.value.slice(0, store.value.length - store.currentTagValue.length)}
        </chakra.span>
        <TaskQuickEditorTagsMenu/>
        <TaskPriorityMenu
          isOpen={store.priorityMenuOpen}
          onFocus={() => store.input.focus()}
          onSelect={store.setPriorityAndCommit}
        />
      </chakra.div>
    </>
  );
});
