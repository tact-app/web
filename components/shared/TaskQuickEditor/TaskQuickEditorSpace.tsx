import React from 'react';
import { observer } from 'mobx-react-lite';
import { Modes, useTaskQuickEditorStore } from './store';
import { Box, Button, ButtonProps, chakra } from '@chakra-ui/react';
import { TaskQuickEditorMenu } from './TaskQuickEditorMenu';
import { ModalsSwitcher } from '../../../helpers/ModalsController';
import { setModifierToColor } from "../../../helpers/baseHelpers";

export const TaskQuickEditorSpace = observer(function TaskQuickEditorSpace({
  withTitle,
  iconSize = 5,
  ...rest
}: {
  iconSize?: number;
  withTitle?: boolean;
} & ButtonProps) {
  const store = useTaskQuickEditorStore();
  const space = store.modes.space.selectedSpace;
  const suggestions = store.modes.space.suggestions

  return space ? (
    <Button
      ref={store.modes.space.setButtonRef}
      onClick={(e) => {
        e.stopPropagation();
        store.suggestionsMenu.openFor(Modes.SPACE);
      }}
      onKeyDown={store.handleKeyDownModeButton(Modes.SPACE)}
      onFocus={store.handleModeFocus(Modes.SPACE)}
      borderRadius='md'
      overflow='hidden'
      display='flex'
      justifyContent='center'
      h={6}
      w={6}
      p={0}
      minW={6}
      bg={setModifierToColor(space.color, 100)}
      _hover={{
        bg: setModifierToColor(space.color, 75),
      }}
      _focus={{
        outline: 'none',
        boxShadow: 'none',
        bg: setModifierToColor(space.color, 200),
      }}
      {...rest}
    >
      <TaskQuickEditorMenu
        items={suggestions}
        openForMode={Modes.SPACE}
      />
      <Box p={iconSize > 5 ? 1 : 0.5} h='100%'>
        <chakra.div borderRadius='full'
          display='flex'
          justifyContent='center'
          alignItems='center'
          w={iconSize}
          h={iconSize}
          fontWeight={600}
          fontSize={iconSize > 6 ? 'lg' : 'sm'}
          color={setModifierToColor(space.color, 500)}>
          {space.icon || space.name[0]}
        </chakra.div>
      </Box>
      <ModalsSwitcher controller={store.modals.controller} />
    </Button>
  ) : null;
});
