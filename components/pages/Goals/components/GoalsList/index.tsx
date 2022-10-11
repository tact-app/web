import { observer } from 'mobx-react-lite';
import { Box, Button } from '@chakra-ui/react';
import { useGoalsStore } from '../../store';
import { DescriptionEditor } from '../../../../shared/DescriptionEditor';

export const GoalsList = observer(function GoalsList() {
  const store = useGoalsStore();

  return (
    <Box>
      <DescriptionEditor/>
    </Box>
  )
})