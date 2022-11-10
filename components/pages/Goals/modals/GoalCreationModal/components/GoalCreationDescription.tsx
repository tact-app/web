import { observer } from 'mobx-react-lite';
import { Box, Center, CircularProgress, Input } from '@chakra-ui/react';
import { useGoalCreationModalStore } from '../store';
import { Editor } from '../../../../../shared/Editor';

export const GoalCreationDescription = observer(
  function GoalCreationDescription() {
    const store = useGoalCreationModalStore();

    return (
      <Box
        maxW='2xl'
        overflow='visible'
        position='absolute'
        left={0}
        right={0}
        m='auto'
      >
        <Input
          size='lg'
          value={store.title}
          autoFocus
          placeholder='Goal name'
          onChange={store.handleTitleChange}
          variant='flushed'
        />
        <Box mt={4}>
          {store.isDescriptionLoading ? (
            <Center>
              <CircularProgress isIndeterminate size='24px' />
            </Center>
          ) : (
            <Editor
              content={
                store.description ? store.description.content : undefined
              }
              onUpdate={store.handleDescriptionChange}
              onSave={store.handleSave}
            />
          )}
        </Box>
      </Box>
    );
  }
);
