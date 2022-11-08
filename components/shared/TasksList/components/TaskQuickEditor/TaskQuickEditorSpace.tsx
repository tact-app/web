import { observer } from 'mobx-react-lite';
import { Modes, useTaskQuickEditorStore } from './store';
import { SpacesSmallIcon } from '../../../../pages/Spaces/components/SpacesIcons/SpacesSmallIcon';
import { Button } from '@chakra-ui/react';
import React from 'react';
import { TaskQuickEditorMenu } from './TaskQuickEditorMenu';

export const TaskQuickEditorSpace = observer(function TaskQuickEditorSpace() {
  const store = useTaskQuickEditorStore();
  const space = store.modes.space.selectedSpace;

  return space ? (
    <Button
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
    >
      <SpacesSmallIcon space={space} size={5} />
      <TaskQuickEditorMenu
        items={store.modes.space.suggestions}
        openForMode={Modes.SPACE}
      />
    </Button>
  ) : null;
});
