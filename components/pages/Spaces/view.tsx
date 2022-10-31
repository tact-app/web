import { observer } from 'mobx-react-lite';
import { SpacesProps, useSpacesStore } from './store';
import { Box } from '@chakra-ui/react';
import { SpacesMenu } from './components/SpacesMenu';
import { SpacesInbox } from './components/SpacesInbox';
import { SpacesFocusableBlocks } from './types';
import { SpacesInboxItem } from './components/SpacesInboxItem';

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
      <Box display='flex' flex={1}>
        <SpacesInbox
          callbacks={{
            onFocus: () => store.handleFocus(SpacesFocusableBlocks.INBOX),
            onFocusLeave: store.handleFocusLeave,
            onSelect: (item) => store.setOpenedItem(item),
          }}
          space={store.currentSpace}
          hotkeysEnabled={store.focusedBlock === SpacesFocusableBlocks.INBOX}
        />
        <SpacesInboxItem item={store.openedItem} />
      </Box>
    </Box>
  );
});
