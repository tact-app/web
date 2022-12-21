import { observer } from 'mobx-react-lite';
import { Box, Button, Text } from '@chakra-ui/react';
import { LargePlusIcon } from '../../../../shared/Icons/LargePlusIcon';
import { useGoalsStore } from '../../store';

export const GoalCreateNewButton = observer(function GoalCreateNewButton() {
  const store = useGoalsStore();

  return (
    <Button
      onClick={store.startGoalCreation}
      size='xl'
      display='inline-flex'
      flexDirection='column'
      alignItems='center'
      borderRadius='xl'
      h={60}
      w={56}
      pt={6}
      pl={14}
      pr={14}
      pb={6}
      mb={10}
      mr={10}
    >
      <Box mb={6}>
        <LargePlusIcon />
      </Box>
      <Text fontSize='lg' fontWeight='semibold' color='gray.400'>
        New goal
      </Text>
    </Button>
  );
});
