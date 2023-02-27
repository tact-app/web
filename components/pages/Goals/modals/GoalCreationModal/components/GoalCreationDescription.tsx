import { observer } from 'mobx-react-lite';
import { Box, Center, CircularProgress, Input, Stack } from '@chakra-ui/react';
import { useGoalCreationModalStore } from '../store';
import { Editor } from '../../../../../shared/Editor';
import { GoalCreationEmojiSelect } from './GoalCreationEmojiSelect';
import React from "react";

export const GoalCreationDescription = observer(
  function GoalCreationDescription() {
    const store = useGoalCreationModalStore();

    return (
      <Box
        display='flex'
        alignItems='center'
        flexDirection='column'
        m='auto'
        width='100%'
        height='100%'
      >
        <Stack
          flexDirection='row'
          maxW='3xl'
          width='100%'
          alignItems='flex-end'
          ml={6}
          mr={6}
          pl={10}
          pr={10}
        >
          <GoalCreationEmojiSelect />
          <Input
            size='lg'
            value={store.title}
            autoFocus
            placeholder='Goal Name'
            _placeholder={{ color: 'gray.400' }}
            onChange={store.handleTitleChange}
            variant='flushed'
            fontSize='md'
            fontWeight='semibold'
            flex={1}
            height='2rem'
            _focusVisible={{
              borderColor: 'blue.400',
              boxShadow: 'none',
            }}
          />
        </Stack>
        <Box mt={8} width='100%' flex={1} position='relative'>
          {store.isDescriptionLoading ? (
            <Center>
              <CircularProgress isIndeterminate size='24px' />
            </Center>
          ) : (
            <Box position='absolute' top={0} left={0} right={0} bottom={0}>
              <Editor
                content={
                  store.description ? store.description.content : undefined
                }
                contentContainerProps={{
                  maxW: '3xl',
                  margin: 'auto',
                  pl: 10,
                  pr: 10,
                }}
                onUpdate={store.handleDescriptionChange}
                onSave={store.handleSave}
              />
            </Box>
          )}
        </Box>
      </Box>
    );
  }
);
