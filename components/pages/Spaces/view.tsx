import { observer } from 'mobx-react-lite';
import { SpacesProps, useSpacesStore } from './store';
import { Box } from '@chakra-ui/react';
import { SpacesMenu } from './components/SpacesMenu';
import { SpacesInbox } from './components/SpacesInbox';
import { SpacesFocusableBlocks } from './types';
import { SpacesInboxItem } from './components/SpacesInboxItem';
import { ResizableGroup } from '../../shared/ResizableGroup';
import { Task } from '../../shared/Task';
import React from 'react';
import { ModalsSwitcher } from '../../../helpers/ModalsController';
import { SpacesTodayHelp } from './components/SpacesTodayHelp';

export const SpacesView = observer(function SpacesView(props: SpacesProps) {
  const store = useSpacesStore();

  return (
    <Box h='100%' display='flex'>
      <ResizableGroup configs={store.resizableConfig}>
        <SpacesMenu
          instance={store.menu}
          callbacks={store.menuCallbacks}
          isHotkeysEnabled={store.focusedBlock === SpacesFocusableBlocks.TREE}
        />
        <SpacesInbox
          instance={store.inbox}
          callbacks={store.inboxCallbacks}
          space={store.currentSpace}
          isHotkeysEnabled={store.focusedBlock === SpacesFocusableBlocks.INBOX}
        />

        {store.openedItem && (
          <SpacesInboxItem
            item={store.openedItem}
            instance={store.inboxItem}
            isHotkeysEnabled={
              store.focusedBlock === SpacesFocusableBlocks.INBOX_ITEM
            }
            callbacks={store.itemCallbacks}
          />
        )}

        {store.inboxItem.list.openedTask && (
          <Box
            p={7}
            h='100%'
            onMouseDown={() =>
              store.handleFocus(SpacesFocusableBlocks.INBOX_ITEM)
            }
          >
            <Task
              task={store.inboxItem.list.openedTaskData}
              spaces={store.inboxItem.list.spaces}
              isEditorFocused={store.inboxItem.list.isEditorFocused}
              callbacks={store.taskCallbacks}
            />
          </Box>
        )}
      </ResizableGroup>
      <SpacesTodayHelp />
      <ModalsSwitcher controller={store.modals.controller} />
    </Box>
  );
});
