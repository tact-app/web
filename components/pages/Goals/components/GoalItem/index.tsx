import { observer } from 'mobx-react-lite';
import { Box, Button, Text } from '@chakra-ui/react';
import { useGoalsStore } from '../../store';
import { GoalIconVariants } from '../../types';

export const GoalItem = observer(function GoalItem({ id }: { id: string }) {
  const store = useGoalsStore();
  const item = store.items[id];

  return (
    <Button
      onClick={() => store.handleGoalClick}
      variant='outline'
      borderRadius='xl'
      h={60}
      w={56}
      p={2}
      mr={10}
      mb={10}
      display='inline-flex'
      flexDirection='column'
      justifyContent='start'
    >
      <Box
        mb={4}
        mt={6}
        w='7.375rem'
        h='7.375rem'
        mr='auto'
        ml='auto'
        borderRadius='full'
        display='flex'
        justifyContent='center'
        flexDirection='column'
        bg={item.icon?.color}
      >
        {item.icon && item.icon.type === GoalIconVariants.EMOJI ? (
          <Text fontSize='7xl'>{item.icon.value}</Text>
        ) : null}
      </Box>
      <Text fontSize='lg' fontWeight='semibold' color='gray.400'>
        {item.title}
      </Text>
    </Button>
  );
});
