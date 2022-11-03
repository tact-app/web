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

const configs = [
  {
    size: 1,
    flexible: true,
  },
  {
    size: 1,
    props: {
      boxShadow: 'lg',
    },
  },
  { size: 1 },
];

export const SpacesView = observer(function SpacesView(props: SpacesProps) {
  const store = useSpacesStore();

  return (
    <Box h='100%' display='flex'>
      <SpacesMenu
        instance={store.menu}
        callbacks={{
          onSpaceChange: store.handleSpaceChange,
          onFocusChange: store.handleFocusChange,
          onFocus: () => store.handleFocus(SpacesFocusableBlocks.TREE),
          onFocusLeave: () => store.handleFocusLeave('right'),
        }}
        hotkeysEnabled={store.focusedBlock === SpacesFocusableBlocks.TREE}
      />
      <ResizableGroup configs={configs}>
        <SpacesInbox
          callbacks={{
            onFocus: () => store.handleFocus(SpacesFocusableBlocks.INBOX),
            onFocusLeave: store.handleFocusLeave,
            onSelect: (item) => store.setOpenedItem(item),
          }}
          space={store.currentSpace}
          hotkeysEnabled={store.focusedBlock === SpacesFocusableBlocks.INBOX}
        />

        {store.openedItem && (
          <SpacesInboxItem
            item={store.openedItem}
            instance={store.inboxItem}
            isHotkeysEnabled={
              store.focusedBlock === SpacesFocusableBlocks.INBOX_ITEM
            }
            callbacks={{
              onFocusLeave: store.handleFocusLeave,
              onFocus: () =>
                store.handleFocus(SpacesFocusableBlocks.INBOX_ITEM),
            }}
          />
        )}

        {store.inboxItem.list.openedTask && (
          <Box
            p={7}
            onMouseDown={() =>
              store.handleFocus(SpacesFocusableBlocks.INBOX_ITEM)
            }
          >
            <Task
              task={store.inboxItem.list.openedTaskData}
              isEditorFocused={store.inboxItem.list.isEditorFocused}
              callbacks={{
                onClose: store.inboxItem.list.closeTask,
                onBlur: store.inboxItem.list.handleEditorBlur,
                onPreviousItem:
                  store.inboxItem.list.draggableList.focusPrevItem,
                onNextItem: store.inboxItem.list.draggableList.focusNextItem,
              }}
            />
          </Box>
        )}
      </ResizableGroup>
    </Box>
  );
});
