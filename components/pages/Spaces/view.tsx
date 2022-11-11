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
          selectedSpaceId={store.selectedSpaceId}
          selectedPath={store.selectedPath}
          callbacks={store.menuCallbacks}
          isHotkeysEnabled={store.focusedBlock === SpacesFocusableBlocks.TREE}
        />
        <SpacesInbox
          instance={store.inbox}
          selectedPath={store.selectedPath}
          itemsLoader={store.getInboxItems}
          callbacks={store.inboxCallbacks}
          space={store.currentSpace}
          isHotkeysEnabled={store.focusedBlock === SpacesFocusableBlocks.INBOX}
        />

        {store.openedItem && (
          <SpacesInboxItem
            item={store.openedItem}
            instance={store.inboxItem}
            isExpanded={store.isInboxItemExpanded}
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
              tagsMap={store.inboxItem.list.tagsMap}
              goals={store.inboxItem.list.goals}
              isEditorFocused={store.inboxItem.list.isEditorFocused}
              isExpanded={store.isInboxItemTaskExpanded}
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
