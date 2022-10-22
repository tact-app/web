import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  DrawerHeader,
  DrawerBody,
  Box,
  Center,
  CircularProgress,
  Heading,
  IconButton,
  CloseButton,
} from '@chakra-ui/react';
import { useTaskStore } from './store';
import { useTasksStore } from '../../store';
import { ResizableDrawer } from '../../../../shared/ResizableDrawer';
import { BlockNoteEditor } from '../../../../shared/BlockNoteEditor';
import {
  ArrowDownIcon,
  ArrowUpIcon,
} from '../../../../shared/Icons/ArrowIcons';

export const TaskView = observer(function TaskView() {
  const store = useTaskStore();
  const tasksStore = useTasksStore();

  console.log(store.isDescriptionLoading, store.description);

  return (
    <ResizableDrawer
      isOpen={Boolean(tasksStore.openedTask)}
      onClose={tasksStore.closeTask}
      pb={8}
    >
      <DrawerHeader
        ml={10}
        mr={8}
        pl={0}
        pr={0}
        pb={2}
        borderBottomWidth='1px'
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        <Box>
          <IconButton
            aria-label={'prev'}
            size='xs'
            variant='ghost'
            onClick={store.handlePreviousItem}
          >
            <ArrowUpIcon />
          </IconButton>
          <IconButton
            aria-label={'prev'}
            size='xs'
            variant='ghost'
            onClick={store.handleNextItem}
          >
            <ArrowDownIcon />
          </IconButton>
        </Box>
        <CloseButton onClick={store.handleClose} color='gray.400' size='sm' />
      </DrawerHeader>
      <DrawerBody ml={10} mr={8}>
        <Heading>{store.data.title}</Heading>
        <Box mt={4}>
          {store.isDescriptionLoading ? (
            <Center>
              <CircularProgress isIndeterminate size='24px' />
            </Center>
          ) : (
            <BlockNoteEditor
              value={store.description ? store.description.content : undefined}
              onChange={store.handleDescriptionChange}
              onBlur={store.handleDescriptionBlur}
            />
          )}
        </Box>
      </DrawerBody>
    </ResizableDrawer>
  );
});
