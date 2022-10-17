import { observer } from 'mobx-react-lite';
import { Box, Heading } from '@chakra-ui/react';
import { useGoalsStore } from '../../store';
import { GoalCreateNewButton } from '../GoalCreateNewButton';
import React from 'react';
import { GoalItem } from '../GoalItem';

export const GoalsList = observer(function GoalsList() {
  const store = useGoalsStore();

  return (
    <Box pl={32} pr={32}>
      <Heading size='md' mt={2.5} mb={8} pt={4}>My Goals</Heading>
      <Box>
        <GoalCreateNewButton/>
        {
          store.order.map((goalId) => (
            <GoalItem key={goalId} id={goalId}/>
          ))
        }
      </Box>
    </Box>
  );
});
