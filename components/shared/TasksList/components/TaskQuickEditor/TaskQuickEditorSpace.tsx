import { observer } from 'mobx-react-lite';
import { Modes, useTaskQuickEditorStore } from './store';
import { SpacesSmallIcon } from '../../../../pages/Spaces/components/SpacesIcons/SpacesSmallIcon';
import { Box, Button, ButtonProps, chakra } from '@chakra-ui/react';
import React from 'react';
import { TaskQuickEditorMenu } from './TaskQuickEditorMenu';

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
      bg={space.color + '.100'}
      _hover={{
        bg: space.color + '.75',
      }}
      _focus={{
        outline: 'none',
        boxShadow: 'none',
        bg: space.color + '.200',
      }}
      {...rest}
    >
      <TaskQuickEditorMenu
        items={store.modes.space.suggestions}
        openForMode={Modes.SPACE}
      />
      <Box p={iconSize > 5 ? 1 : 0.5} h='100%'>
        {withTitle ? (
          <chakra.span
            borderRadius='full'
            pl={2}
            pr={2}
            maxW={28}
            h='100%'
            verticalAlign='middle'
            transitionProperty='common'
            transitionDuration='normal'
            bg={space.color + '.200'}
            color={space.color + '.500'}
            display='flex'
            alignItems='center'
          >
            <chakra.span
              overflow='hidden'
              textOverflow='ellipsis'
              fontWeight={600}
              fontSize='sm'
            >
              {space.name}
            </chakra.span>
          </chakra.span>
        ) : (
          <chakra.div flex={1} display='flex' alignItems='center'>
            <SpacesSmallIcon space={space} size={iconSize} />
          </chakra.div>
        )}
      </Box>
    </Button>
  ) : null;
});
