import { observer } from 'mobx-react-lite';
import { useTaskQuickEditorStore } from './store';
import { Box, chakra, Input, InputProps } from '@chakra-ui/react';
import React from 'react';
import { TaskQuickEditorMenu } from './TaskQuickEditorMenu';
import { TextareaAutofit } from '../TextareaAutofit';

export const TaskQuickEditorInput = observer(function TaskQuickEditInput({
  placeholder,
  multiline,
  ...rest
}: {
  placeholder?: string;
  multiline?: boolean;
} & InputProps) {
  const store = useTaskQuickEditorStore();
  const items = store.activeMode ? store.activeMode.suggestions : [];

  return (
    <Box w='100%' position='relative'>
      <chakra.div
        position='absolute'
        overflow='hidden'
        maxW='100%'
        h='100%'
        display='flex'
      >
        <chakra.span
          visibility='hidden'
          overflow='hidden'
          whiteSpace='nowrap'
          {...rest}
        >
          {store.isModeActive
            ? store.value.slice(0, store.modeStartPos)
            : store.value}
        </chakra.span>
        <TaskQuickEditorMenu items={items} />
      </chakra.div>
      {multiline ? (
        <TextareaAutofit
          borderRadius='none'
          minH={9}
          ref={store.inputRef}
          type='text'
          maxLength={store.maxLength}
          variant='unstyled'
          placeholder={placeholder}
          value={store.value}
          onChange={store.handleChange}
          onFocus={store.handleFocus}
          onKeyDown={store.handleKeyDown}
          onSelect={store.handleSelect}
          resize='none'
          border='none'
          wordBreak='break-word'
          overflow='hidden'
          {...rest}
        />
      ) : (
        <Input
          size='md'
          type='text'
          maxLength={store.maxLength}
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
      )}
    </Box>
  );
});
