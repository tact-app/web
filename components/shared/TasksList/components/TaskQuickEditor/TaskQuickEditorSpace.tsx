import { observer } from 'mobx-react-lite';
import { Modes, useTaskQuickEditorStore } from './store';
import { SpacesSmallIcon } from '../../../../pages/Spaces/components/SpacesIcons/SpacesSmallIcon';
import { Button, ButtonProps, chakra } from '@chakra-ui/react';
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
      onKeyDown={store.handleKeyDownWithModeMenu(Modes.SPACE)}
      borderRadius='md'
      overflow='hidden'
      display='flex'
      justifyContent='center'
      h={6}
      w={6}
      minW={6}
      bg={space.color + '.100'}
      p={1}
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
      {withTitle ? (
        <chakra.span
          fontSize='sm'
          borderRadius='full'
          pl={2}
          pr={2}
          maxW={28}
          h='100%'
          verticalAlign='middle'
          overflow='hidden'
          textOverflow='ellipsis'
          bg={space.color + '.200'}
          color={space.color + '.500'}
          fontWeight={600}
          display='flex'
          alignItems='center'
        >
          {space.name}
        </chakra.span>
      ) : (
        <chakra.div flex={1} display='flex' alignItems='center'>
          <SpacesSmallIcon space={space} size={iconSize} />
        </chakra.div>
      )}
      <TaskQuickEditorMenu
        items={store.modes.space.suggestions}
        openForMode={Modes.SPACE}
      />
    </Button>
  ) : null;
});
