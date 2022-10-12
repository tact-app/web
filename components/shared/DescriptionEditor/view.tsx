import { observer } from 'mobx-react-lite';
import { Box, Container, IconButton } from '@chakra-ui/react';
import React from 'react';
import { useDescriptionEditorStore } from './store';
import { DraggableListStoreProvider } from '../DraggableList/store';
import { DraggableListView } from '../DraggableList/view';
import { DescriptionEditorBlock } from './components/DescriptionEditorBlock';
import { PlusIcon } from '../../pages/Inbox/components/TaskIcons/PlusIcon';
import { DescriptionEditorCreateMenu } from './components/DescriptionEditorCreateMenu';
import { BlockTypesOptions } from './types';

const DescriptionEditorPlusButton = observer(function DescriptionEditorPlusButton({
                                                                                    id,
                                                                                    snapshot
                                                                                  }: { id: string, snapshot: any }) {
  const store = useDescriptionEditorStore();

  return (
    <Box flexDirection='column' justifyContent='start' display='flex'>
      <IconButton
        size='xs'
        aria-label='Add new item'
        icon={<PlusIcon/>}
        onClick={() => store.openBlocksMenu(id)}
        variant='unstyled'
        visibility={snapshot.isDragging && !store.draggableList.isControlDraggingActive ? 'visible' : 'hidden'}
        _groupHover={{
          visibility: !store.draggableList.isDraggingActive ? 'visible' : 'hidden',
        }}
      />
      {store.openedBlocksMenuId === id && (
        <Box position='absolute' zIndex={1000} top='12'>
          <DescriptionEditorCreateMenu
            onSelect={({ value, config }) => store.addBlock(id, value, config)}
            onClose={() => store.closeBlocksMenu()}
            items={BlockTypesOptions}
          />
        </Box>
      )}
    </Box>
  );
});

export const DescriptionEditorView = observer(function DescriptionEditorView() {
  const store = useDescriptionEditorStore();

  return (
    <Container maxW='container.md'>
      <DraggableListStoreProvider
        instance={store.draggableList}
        items={store.order}
        callbacks={store.draggableCallbacks}
      >
        <DraggableListView
          prefix={DescriptionEditorPlusButton}
          content={DescriptionEditorBlock}
        />
      </DraggableListStoreProvider>
    </Container>
  );
});