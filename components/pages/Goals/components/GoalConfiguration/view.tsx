import { observer } from 'mobx-react-lite';
import { Box, Input } from '@chakra-ui/react';
import { useGoalConfigurationStore } from './store';

export const GoalConfigurationView = observer(function GoalConfigurationView() {
  const store = useGoalConfigurationStore();

  return (
    <Box>
      <form>
        <Input
          value={store.value}
          onChange={store.handleChange}
          placeholder='Goal'
        />
      </form>
    </Box>
  );
});
