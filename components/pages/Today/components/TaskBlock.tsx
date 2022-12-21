import { observer } from 'mobx-react-lite';
import { Box } from '@chakra-ui/react';
import { Task } from '../../../shared/Task';
import React from 'react';
import { useTodayStore } from '../store';

export const TaskBlock = observer(function TaskBlock() {
  const store = useTodayStore();

  return (
    <Box h='100%'>{store.taskProps.task && <Task {...store.taskProps} />}</Box>
  );
});
