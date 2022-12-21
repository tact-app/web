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
import { ResizableGroupChild } from '../../shared/ResizableGroup/ResizableGroupChild';

export const SpacesView = observer(function SpacesView(props: SpacesProps) {
  const store = useSpacesStore();

  return (
    <Box h='100%' display='flex'>
      <ResizableGroup>
        <ResizableGroupChild
          index={0}
          config={store.resizableConfig[0]}
          boxShadow='lg'
        >
          <SpacesMenu
            instance={store.menu}
            selectedSpaceId={store.selectedSpaceId}
            selectedPath={store.selectedPath}
            callbacks={store.menuCallbacks}
            isHotkeysEnabled={store.focusedBlock === SpacesFocusableBlocks.TREE}
          />
        </ResizableGroupChild>
        <ResizableGroupChild index={1} config={store.resizableConfig[1]}>
          <SpacesInbox
            instance={store.inbox}
            selectedPath={store.selectedPath}
            itemsLoader={store.getInboxItems}
            callbacks={store.inboxCallbacks}
            space={store.currentSpace}
            isHotkeysEnabled={
              store.focusedBlock === SpacesFocusableBlocks.INBOX
            }
          />
        </ResizableGroupChild>
        <ResizableGroupChild
          index={2}
          config={store.resizableConfig[2]}
          boxShadow='lg'
        >
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
        </ResizableGroupChild>
        <ResizableGroupChild index={3} config={store.resizableConfig[3]}>
          {store.inboxItem.listWithCreator.list.openedTask && (
            <Task
              task={store.inboxItem.listWithCreator.list.openedTaskData}
              hasNext={store.inboxItem.listWithCreator.list.hasNextTask}
              hasPrevious={store.inboxItem.listWithCreator.list.hasPrevTask}
              isEditorFocused={
                store.inboxItem.listWithCreator.list.isEditorFocused
              }
              isExpanded={store.isInboxItemTaskExpanded}
              callbacks={store.taskCallbacks}
            />
          )}
        </ResizableGroupChild>
      </ResizableGroup>
      <SpacesTodayHelp />
      <ModalsSwitcher controller={store.modals.controller} />
    </Box>
  );
});
