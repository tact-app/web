import { observer } from 'mobx-react-lite';
import {
  Box,
  Button,
  Text,
  List,
} from '@chakra-ui/react';
import { useGoalsSelectionStore } from './store';
import { GoalsSelectionSpace } from './components/GoalsSelectionSpace';
import React from 'react';
import { QuestionWithTooltip } from '../QuestionWithTooltip';
import { GoalsSelectionAdditionalItems } from "./components/GoalsSelectionAdditionalItems";

export const GoalsSelectionView = observer(function GoalsSelectionView() {
  const store = useGoalsSelectionStore();

  if (store.root.resources.goals.haveGoals) {
    return (
      <List h='100%' overflowY='auto' pl={1} pr={1}>
        {store.root.resources.goals.listBySpaces.map(({ space, goals }) => (
          <GoalsSelectionSpace key={space.id} space={space} goals={goals} />
        ))}
        <GoalsSelectionAdditionalItems />
      </List>
    );
  }

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems={store.forModal ? 'center' : 'flex-start'}
      justifyContent='center'
      pl={1}
      pr={1}
    >
      <Text fontSize='xs' fontWeight='normal' lineHeight={4} display='flex'>
        You haven’t created any goal yet
        {!store.forModal && (
          <QuestionWithTooltip
            tooltipLabel='A goal allows you to identify a meaningful destination point, the pursuit of which is essential to you.'
          />
        )}
      </Text>
      <Button
        fontSize='xs'
        mt={3}
        ml={store.forModal ? 0 : -2}
        variant='ghost'
        size='xs'
        color='blue.400'
        fontWeight='normal'
        _hover={{ bg: 'gray.75' }}
        ref={(el) => store.callbacks?.setRefs?.(0, el)}
        onClick={store.callbacks?.onGoalCreateClick}
      >
        <Text decoration='underline' mr={1}>Create new</Text> 🎯
      </Button>
    </Box>
  );
});
