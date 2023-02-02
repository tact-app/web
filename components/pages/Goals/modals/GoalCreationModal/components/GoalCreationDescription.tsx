import { observer } from 'mobx-react-lite';
import { Box, Center, CircularProgress, Input } from '@chakra-ui/react';
import { useGoalCreationModalStore } from '../store';
import { Editor } from '../../../../../shared/Editor';

export const GoalCreationDescription = observer(
  function GoalCreationDescription() {
    const store = useGoalCreationModalStore();

    return (
      <Box
        overflow='visible'
        position='absolute'
        left={0}
        right={0}
        top={0}
        bottom={0}
        display='flex'
        alignItems='center'
        flexDirection='column'
        m='auto'
      >
        <Input
          size='lg'
          value={store.title}
          autoFocus
          placeholder='Goal name'
          onChange={store.handleTitleChange}
          variant='flushed'
          ml={6}
          mr={6}
          fontSize='2xl'
          maxW='2xl'
          fontWeight='semibold'
          _focusVisible={{
            borderColor: 'blue.400',
            boxShadow: 'none',
          }}
        />
        <Box mt={4} width='100%' flex={1}>
          {store.isDescriptionLoading ? (
            <Center>
              <CircularProgress isIndeterminate size='24px' />
            </Center>
          ) : (
            <Editor
              content={
                store.description ? store.description.content : undefined
              }
              contentContainerProps={{
                  maxW: '2xl',
                  margin: 'auto',
              }}
              onUpdate={store.handleDescriptionChange}
              onSave={store.handleSave}
            />
          )}
        </Box>
      </Box>
    );
  }
);
