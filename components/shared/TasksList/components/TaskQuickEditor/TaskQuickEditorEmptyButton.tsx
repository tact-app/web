import { Modes, useTaskQuickEditorStore } from './store';
import { TaskQuickEditorMenu } from './TaskQuickEditorMenu';
import { Button, ButtonProps, chakra } from '@chakra-ui/react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { HeavyPlusIcon } from '../../../Icons/HeavyPlusIcon';

export const TaskQuickEditorEmptyButton = observer(
  function TaskQuickEditorEmptyButton({
    disabled,
    title,
    mode,
    ...rest
  }: ButtonProps & {
    mode: Modes;
    disabled?: boolean;
    title: string;
  }) {
    const store = useTaskQuickEditorStore();

    return (
      <Button
        ref={store.modes[mode].setButtonRef}
        tabIndex={disabled ? -1 : 0}
        onClick={(e) => {
          e.stopPropagation();
          store.suggestionsMenu.openFor(mode);
        }}
        onKeyDown={store.handleKeyDownModeButton(mode)}
        onFocus={store.handleModeFocus(mode)}
        variant='ghost'
        borderRadius='md'
        overflow='hidden'
        display='flex'
        justifyContent='flex-start'
        h={6}
        w={6}
        p={0}
        minW={6}
        bg='gray.50'
        _hover={{ bg: 'gray.100' }}
        _active={{ bg: 'gray.200' }}
        _focus={{
          outline: 'none',
          boxShadow: 'none',
          bg: 'gray.200',
        }}
        {...rest}
      >
        <TaskQuickEditorMenu
          items={store.modes[mode].suggestions}
          openForMode={mode}
        />
        <HeavyPlusIcon />
        <chakra.span
          fontSize='sm'
          fontWeight='normal'
          color='gray.400'
          pr={1}
          pl={1}
        >
          {title}
        </chakra.span>
      </Button>
    );
  }
);
