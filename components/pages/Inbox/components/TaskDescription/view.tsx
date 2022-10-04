import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Flex, Text, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useTaskDescriptionStore } from './store';
import { useTasksStore } from '../../store';
import styles from './TaskDescription.module.css';

export const TaskDescriptionView = observer(function TaskDescriptionView() {
  const store = useTaskDescriptionStore();
  const tasksStore = useTasksStore();
  const ref = useRef<null | HTMLDivElement>(null);

  useEffect(() => store.setRef(ref.current), [store, ref.current]);

  return (
    <Box className={styles.root}>
      <Flex justifyContent='space-between'>
        <Text>{store.data.title}</Text>
        <IconButton aria-label='Close task' icon={<CloseIcon/>} size={'xs'} onClick={tasksStore.closeTask}/>
      </Flex>
      <Box p={8}>
        <div ref={ref}/>
      </Box>
    </Box>
  );
});