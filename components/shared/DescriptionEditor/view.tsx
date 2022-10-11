import { observer } from 'mobx-react-lite';
import { Box, chakra, IconButton } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';
import { useDescriptionEditorStore } from './store';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { DraggableListStoreProvider } from '../DraggableList/store';
import { DraggableListView } from '../DraggableList/view';

const DescriptionEditorPlusButton = observer(function DescriptionEditorPlusButton() {
  const store = useDescriptionEditorStore();

  return (
    <IconButton aria-label={'Add new item'} icon={<PlusSquareIcon/>} onClick={store.addDefaultBlock}/>
  );
});

const DescriptionEditorContent = observer(function DescriptionEditorContent({
                                                                              id,
                                                                              isFocused
                                                                            }: { id: string, isFocused: boolean }) {
  const store = useDescriptionEditorStore();

  return (
    <chakra.div onClick={() => store.draggableList.setFocusedItem(id)} bg={isFocused ? 'red' : 'white'}>
      {store.blocks[id].content}
    </chakra.div>
  );
});

export const DescriptionEditorView = observer(function DescriptionEditorView() {
  const store = useDescriptionEditorStore();

  return (
    <Box>
      <DraggableListStoreProvider instance={store.draggableList} items={store.order}>
        <DraggableListView
          prefix={DescriptionEditorPlusButton}
          content={DescriptionEditorContent}
        />
      </DraggableListStoreProvider>
    </Box>
  );
});