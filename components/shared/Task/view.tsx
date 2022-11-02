import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Center,
  CircularProgress,
  Heading,
  IconButton,
  CloseButton,
} from '@chakra-ui/react';
import { useTaskStore } from './store';
import { ArrowDownIcon, ArrowUpIcon } from '../Icons/ArrowIcons';
import { Editor } from '../Editor';

export const TaskView = observer(function TaskView() {
  const store = useTaskStore();

  return (
    <Box pt={6} pr={7} pl={7}>
      <Box
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
      </Box>
      <Box mt={6} ml={10}>
        <Heading fontSize='2xl' fontWeight='semibold'>
          {store.data.title}
        </Heading>
        <Box mt={4}>
          {store.isDescriptionLoading ? (
            <Center>
              <CircularProgress isIndeterminate size='24px' />
            </Center>
          ) : (
            <Editor
              isFocused
              content={
                store.description ? store.description.content : undefined
              }
              onUpdate={store.handleDescriptionChange}
              onBlur={store.handleDescriptionBlur}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
});
