import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Center,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  HStack,
  Text,
  useOutsideClick,
} from '@chakra-ui/react';
import { useTaskStore } from './store';
import { ItemToolbar } from '../ItemToolbar/itemToolbar';
import { OriginIcon } from '../../pages/Spaces/components/SpacesIcons/OriginsIcons';
import { TaskQuickEditorStoreProvider } from '../TaskQuickEditor/store';
import { TaskQuickEditorInput } from '../TaskQuickEditor/TaskQuickEditorInput';
import { TaskQuickEditorTags } from '../TaskQuickEditor/TaskQuickEditorTags';
import { TaskStatus } from '../TasksList/types';
import { TaskModesMenu } from './TaskModesMenu';
import { TaskEditor } from './TaskEditor';

export const TaskView = observer(function TaskView() {
  const store = useTaskStore();
  const ref = useRef();

  useOutsideClick({
    ref,
    handler: store.quickEditor.handleClickOutside,
  });

  useEffect(() => store.saveDescription, [store]);

  return (
    <Container
      tabIndex={0}
      onMouseDown={store.callbacks.onFocus}
      onKeyDown={store.handleContainerKeyDown}
      h='100%'
      maxW='container.md'
      p={6}
      pb={0}
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      _focus={{
        outline: 'none',
      }}
    >
      <TaskQuickEditorStoreProvider
        instance={store.quickEditor}
        callbacks={store.quickEditorCallbacks}
        order={store.modesOrder}
        task={store.data}
        disableGoalChange={store.disableGoalChange}
        disableSpaceChange={store.disableSpaceChange}
      >
        <ItemToolbar
            onPreviousItem={store.handlePreviousItem}
            onNextItem={store.handleNextItem}
            onClose={store.handleClose}
            onExpand={store.handleExpand}
            onCollapse={store.handleCollapse}
            hasPreviousItem={store.hasPrevious}
            hasNextItem={store.hasNext}
            isExpanded={store.isExpanded}
        />
        <Box mt={6}>
          <TaskModesMenu />
        </Box>
        <Box minH={0} flex={1} display='flex' flexDirection='column'>
            <Box
              transition='opacity 0.2s ease-in-out'
              display='flex'
              flexDirection='column'
              h='100%'
              opacity={
                store.isWontDo &&
                !store.isEditorFocused &&
                !store.quickEditor.isInputFocused
                  ? 0.5
                  : 1
              }
            >
              <HStack ref={ref} alignItems='start'>
                <Box h='100%' display='flex' alignItems='center'>
                  <Checkbox
                    variant='indeterminateUnfilled'
                    bg='white'
                    size='lg'
                    cursor='pointer'
                    isChecked={store.data.status === TaskStatus.DONE}
                    isIndeterminate={store.data.status === TaskStatus.WONT_DO}
                    onChange={store.handleStatusChange}
                    name='task-status'
                  />
                </Box>
                <TaskQuickEditorInput
                  fontSize='2xl'
                  fontWeight='semibold'
                  multiline
                />
              </HStack>
              <Box mt={4} id='editor' overflow='hidden' flex={1} ml={-6} mr={-6}>
                {store.isDescriptionLoading ? (
                  <Center>
                    <CircularProgress isIndeterminate size='24px' />
                  </Center>
                ) : (
                  <TaskEditor />
                )}
              </Box>
          </Box>
          {store.isWontDo && store.data.wontDoReason && (
            <Box>
              <Divider mt={8} mb={6} />
              <Text fontSize='md' fontWeight='semibold'>
                Why you weren&apos;t able to manage this task?
              </Text>
              <Text fontSize='sm' fontWeight='normal' mt={2}>
                {store.data.wontDoReason}
              </Text>
            </Box>
          )}
        </Box>
        {store.data.input && store.inputSpace ? (
          <Box mt={2} mb={2}>
            <Divider />
            <Box
              borderColor='gray.200'
              display='flex'
              alignItems='center'
              pt={2}
              pb={2}
            >
              <OriginIcon origin={store.data.input.origin.type} />
              <Text fontSize='xs' fontWeight='normal' ml={1}>
                {store.data.input.title}
              </Text>
            </Box>
            <Divider />
          </Box>
        ) : null}
        <TaskQuickEditorTags
          boxProps={{
            display: 'inline',
            pb: 6,
          }}
          buttonProps={{
            mt: 2,
          }}
          autoSave
        />
      </TaskQuickEditorStoreProvider>
    </Container>
  );
});
