import { observer } from 'mobx-react-lite';
import { chakra, Box, Center, CircularProgress, Input, Flex, FormControl } from '@chakra-ui/react';
import { useGoalCreationModalStore } from '../store';
import { Editor } from '../../../../../shared/Editor';
import React from 'react';
import { FormError } from "../../../../../shared/FormError";
import { GoalEmojiSelect } from "../../../components/GoalEmojiSelect";
import { GOAL_TITLE_MAX_LENGTH } from '../constants';

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
        <Flex
          flexDirection='row'
          maxW='3xl'
          width='100%'
          alignItems='flex-end'
          ml={6}
          mr={6}
          pl={10}
          pr={10}
        >
          <GoalEmojiSelect
            ref={store.setEmojiSelectRef}
            onNavigate={store.handleEmojiSelectNavigate}
            goal={store.goal}
            onColorChange={store.handleColorSelect}
            onIconChange={store.handleEmojiSelect}
          />
          <chakra.div flex={1} ml={4}>
            <FormControl isInvalid={Boolean(store.error)}>
              <Input
                ref={store.setTitleInputRef}
                size='lg'
                value={store.goal.title}
                autoFocus
                placeholder='Goal Name'
                _placeholder={{ color: 'gray.400' }}
                onChange={store.handleTitleChange}
                onBlur={store.handleGoalParamBlur}
                variant='flushed'
                fontSize='md'
                fontWeight='semibold'
                textDecoration={store.isGoalFinished ? 'line-through' : 'none'}
                color={store.isGoalFinished ? 'gray.400' : 'initial'}
                height='2rem'
                _focusVisible={{
                  borderColor: 'blue.400',
                  boxShadow: 'none',
                  borderBottomWidth: 2,
                }}
                maxLength={GOAL_TITLE_MAX_LENGTH}
                onKeyDown={store.handleTitleKeyDown}
                _invalid={{
                  boxShadow: 'none',
                }}
              />
              <FormError inControl>{store.error}</FormError>
            </FormControl>
          </chakra.div>
        </Flex>
        <Box mt={8} width='100%' flex={1} position='relative'>
          {store.isDescriptionLoading ? (
            <Center>
              <CircularProgress isIndeterminate size='24px' />
            </Center>
          ) : (
            <Box position='absolute' top={0} left={0} right={0} bottom={0}>
              <Editor
                editorRef={store.setEditorRef}
                onLeave={store.handleEditorLeave}
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
                onBlur={store.handleGoalParamBlur}
              />
            </Box>
          )}
        </Box>
      </Box>
    );
  }
);
