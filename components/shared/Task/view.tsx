import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Center,
  CircularProgress,
  Container,
  Heading,
} from '@chakra-ui/react';
import { useTaskStore } from './store';
import { Editor } from '../Editor';
import { ItemToolbar } from '../ItemToolbar/itemToolbar';

export const TaskView = observer(function TaskView() {
  const store = useTaskStore();

  return (
    <Container overflow='auto' h='100%' maxW='container.md' p={0}>
      <ItemToolbar
        onPreviousItem={store.handlePreviousItem}
        onNextItem={store.handleNextItem}
        onClose={store.handleClose}
        onExpand={store.handleExpand}
        onCollapse={store.handleCollapse}
      />
      <Heading fontSize='2xl' mt={6} fontWeight='semibold'>
        {store.data.title}
      </Heading>
      <Box mt={4} id='editor'>
        {store.isDescriptionLoading ? (
          <Center>
            <CircularProgress isIndeterminate size='24px' />
          </Center>
        ) : (
          <Editor
            content={store.description ? store.description.content : undefined}
            isFocused={store.isEditorFocused}
            onUpdate={store.handleDescriptionChange}
            onBlur={store.handleDescriptionBlur}
          />
        )}
      </Box>
    </Container>
  );
});
