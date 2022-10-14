import { observer } from 'mobx-react-lite';
import { Box, Center, CircularProgress, Input } from '@chakra-ui/react';
import { useGoalCreationModalStore } from '../store';
import { BlockNoteEditor } from '../../../../../shared/BlockNoteEditor';

export const GoalCreationDescription = observer(function GoalCreationDescription() {
  const store = useGoalCreationModalStore();

  return (
    <Box maxW='2xl' overflow='visible' m='auto'>
      <Input size='lg' value={store.title} autoFocus placeholder='Goal name' onChange={store.handleTitleChange}
             variant='flushed'/>
      <Box mt={4} position='absolute' w='100%'>
        {store.isDescriptionLoading ? (
          <Center>
            <CircularProgress isIndeterminate size='24px'/>
          </Center>
        ) : (
          <BlockNoteEditor
            value={store.description ? store.description.content : undefined}
            onChange={store.handleDescriptionChange}
          />
        )}
      </Box>
    </Box>
  );
});
