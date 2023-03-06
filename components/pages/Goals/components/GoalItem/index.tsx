import { observer } from 'mobx-react-lite';
import { chakra, Box, Button, Text, Flex, HStack } from '@chakra-ui/react';
import { useGoalsStore } from '../../store';
import { GoalIconVariants } from '../../types';
import { DatePicker } from "../../../../shared/DatePicker/DatePicker";

export const GoalItem = observer(function GoalItem({ id }: { id: string }) {
  const store = useGoalsStore();
  const item = store.root.resources.goals.map[id];

  return (
    <Box borderWidth={1} borderRadius={8} borderColor='gray.200' p={4} w={80}>
      <Flex>
        <Flex
          alignItems='center'
          justifyContent='center'
          w={12}
          h={12}
          borderRadius='full'
          bg={item.icon.color}
        >
          <Text fontSize='xl'>{item.icon.value}</Text>
        </Flex>
        <chakra.div ml={2}>
          <Text fontSize='md' fontWeight='semibold'>{item.title}</Text>
          <chakra.span mt={1} color='gray.500'>All task: 10</chakra.span>
        </chakra.div>
      </Flex>
      <Flex mt={2}>
        <HStack flexDirection='column' alignItems='flex-start' width='50%'>
          <chakra.span>
            Start date:
          </chakra.span>
          <chakra.span>
            <DatePicker showIconOnlyIfEmpty value={item.startDate} onChange={() => null} />
          </chakra.span>
        </HStack>
        <HStack flexDirection='column' alignItems='flex-start' width='50%'>
          <chakra.span>
            Target date:
          </chakra.span>
          <chakra.span>
            <DatePicker showIconOnlyIfEmpty value={item.targetDate} onChange={() => null} />
          </chakra.span>
        </HStack>
      </Flex>
    </Box>
  );

  return (
    <Button
      onClick={() => store.editGoal(id)}
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
      <Text
        fontSize='lg'
        fontWeight='semibold'
        color='gray.400'
        width='100%'
        flex={1}
        textOverflow='ellipsis'
        whiteSpace='nowrap'
        overflow='hidden'
      >
        {item.title}
      </Text>
    </Button>
  );
});
