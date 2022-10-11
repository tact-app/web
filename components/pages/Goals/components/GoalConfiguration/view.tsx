import { observer } from 'mobx-react-lite';
import { Box, Button, Grid, Input } from '@chakra-ui/react';
import { useGoalConfigurationStore } from './store';
import { PlusSquareIcon } from '@chakra-ui/icons';

export const GoalConfigurationView = observer(function GoalConfigurationView() {
  const store = useGoalConfigurationStore();

  return (
    <Box>
      <form>
        <Input value={store.value} onChange={store.handleChange} placeholder='Goal'/>
      </form>
    </Box>
  );
});