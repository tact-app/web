import { observer } from 'mobx-react-lite';
import { Modes, useTaskQuickEditorStore } from './store';
import { Button, ButtonProps, chakra } from '@chakra-ui/react';
import React from 'react';
import { TaskQuickEditorMenu } from './TaskQuickEditorMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarLines } from '@fortawesome/pro-light-svg-icons';

export const TaskQuickEditorReference = observer(
  function TaskQuickEditorReference(props: ButtonProps) {
    const store = useTaskQuickEditorStore();
    const reference = store.modes.reference.selectedReference;

    return reference ? (
      <Button
        ref={store.modes.reference.setButtonRef}
        onClick={(e) => {
          e.stopPropagation();
          store.suggestionsMenu.openFor(Modes.REFERENCE);
        }}
        onKeyDown={store.handleKeyDownModeButton(Modes.REFERENCE)}
        onFocus={store.handleModeFocus(Modes.REFERENCE)}
        display='flex'
        h={6}
        justifyContent='center'
        variant='unstyled'
        _focus={{
          outline: 'none',
          boxShadow: 'none',
        }}
        pl={2}
        pr={2}
        pt={0.5}
        pb={1}
        bg='blue.400'
        color='white'
        borderRadius='lg'
        borderTopRadius='none'
        {...props}
      >
        <TaskQuickEditorMenu
          items={store.modes.reference.suggestions}
          openForMode={Modes.REFERENCE}
        />
        <FontAwesomeIcon icon={faCalendarLines} />
        <chakra.span
          fontSize='sm'
          fontWeight='normal'
          ml={1}
          maxW={28}
          overflow='hidden'
          textOverflow='ellipsis'
        >
          {reference.title.slice(1)}
        </chakra.span>
      </Button>
    ) : null;
  }
);
