import { observer } from 'mobx-react-lite';
import { Box, Container, Input } from '@chakra-ui/react';
import { useGoalCreationModalStore } from '../store';
import { BlockNoteEditor } from '../../../../../shared/BlockNoteEditor';

export const GoalCreationDescription = observer(function GoalCreationDescription() {
  const store = useGoalCreationModalStore();

  return (
    <Container maxW='2xl'>
      <Input size='lg' value={store.title} autoFocus placeholder='Goal name' onChange={store.handleTitleChange}
             variant='flushed'/>
      <Box mt={4}>
        <BlockNoteEditor value={store.description} onChange={store.handleDescriptionChange}/>
      </Box>
    </Container>
  );
});
