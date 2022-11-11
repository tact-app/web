import { observer } from 'mobx-react-lite';
import { useTaskQuickEditorStore } from './store';
import { Box, chakra, Input, InputProps } from '@chakra-ui/react';
import React from 'react';
import { TaskQuickEditorMenu } from './TaskQuickEditorMenu';

export const TaskQuickEditorInput = observer(function TaskQuickEditInput({
  placeholder,
  autofocus,
  ...rest
}: {
  placeholder?: string;
  autofocus?: boolean;
} & InputProps) {
  const store = useTaskQuickEditorStore();

  let items = store.activeMode ? store.activeMode.suggestions : [];

  return (
    <Box w='100%'>
      <chakra.div position='absolute'>
        <chakra.span visibility='hidden'>
          {store.isModeActive
            ? store.value.slice(0, store.modeStartPos)
            : store.value}
        </chakra.span>
        <TaskQuickEditorMenu items={items} />
      </chakra.div>
      <Input
        size='md'
        autoFocus={autofocus}
        variant='unstyled'
        placeholder={placeholder}
        value={store.value}
        onChange={store.handleChange}
        onFocus={store.handleFocus}
        onKeyDown={store.handleKeyDown}
        onSelect={store.handleSelect}
        ref={store.inputRef}
        {...rest}
      />
    </Box>
  );
});
