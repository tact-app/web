import { observer } from 'mobx-react-lite';
import { Box, List, Button } from '@chakra-ui/react';
import { useGoalsSelectionStore } from './store';
import React, { useRef } from 'react';
import { LargePlusIcon } from '../Icons/LargePlusIcon';
import { GoalsSelectionSpace } from "./components/GoalsSelectionSpace";

export const GoalsSelectionView = observer(function GoalsSelectionView() {
  const store = useGoalsSelectionStore();
  const ref = useRef();

  return store.root.resources.goals.count ? (
    <List ref={ref} h='100%' overflowY='auto' pl={1} pr={1}>
      {store.root.resources.goals.listBySpaces.map(({ space, goals }) => (
        <GoalsSelectionSpace key={space.id} space={space} goals={goals} />
      ))}
    </List>
  ) : (
    <Box ref={ref}>
      <Button
        ref={(el) => store.callbacks?.setRefs?.(0, el)}
        h={36}
        w='100%'
        p={6}
        fontSize='lg'
        fontWeight='semibold'
        color='gray.400'
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        onClick={store.callbacks.onGoalCreateClick}
        _focus={{
          boxShadow: 'var(--chakra-shadows-outline)',
        }}
      >
        <LargePlusIcon />
        New goal
      </Button>
    </Box>
  );
});
