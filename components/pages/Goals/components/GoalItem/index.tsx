import { observer } from 'mobx-react-lite';
import { chakra, Box, Text, Flex } from '@chakra-ui/react';
import { useGoalsStore } from '../../store';
import { DatePicker } from "../../../../shared/DatePicker/DatePicker";
import { faCircleCheck, faCircleMinus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { GoalDataExtended } from "../../types";
import { EmojiSelect } from "../../../../shared/EmojiSelect";

export const GoalItem = observer(function GoalItem({ goal }: { goal: GoalDataExtended }) {
  const store = useGoalsStore();

  const handleChangeStartDate = (date: string) => {
    store.updateGoal({ ...goal, startDate: date });
  };
  const handleChangeTargetDate = (date: string) => {
    store.updateGoal({ ...goal, targetDate: date });
  };

  return (
    <Box
      borderWidth={1}
      borderRadius={8}
      borderColor='gray.200'
      p={4}
      w={80}
      mr={6}
      mb={6}
      float='left'
    >
      <Flex>
        <EmojiSelect
          icon={goal.icon.value}
          color={goal.icon.color}
          size={12}
          iconFontSize='3xl'
        />
        <chakra.div ml={2}>
          <Text fontSize='md' fontWeight='semibold'>{goal.title}</Text>
          <Flex mt={1} fontSize='xs' color='gray.500'>
            <chakra.span>All task: {goal.allTasks.length}</chakra.span>
            <chakra.span ml={2}>
              <FontAwesomeIcon icon={faCircleCheck} color='var(--chakra-colors-blue-400' /> {goal.doneTasks.length}
            </chakra.span>
            <chakra.span ml={2}>
              <FontAwesomeIcon icon={faCircleMinus} color='var(--chakra-colors-gray-400' /> {goal.wontDoTasks.length}
            </chakra.span>
          </Flex>
        </chakra.div>
      </Flex>
      <Flex mt={2} color='gray.500'>
        <Flex flexDirection='column' alignItems='flex-start' width='50%'>
          <Text fontSize='xs' lineHeight={4}>
            Start date:
          </Text>
          <chakra.div mt={1}>
            <DatePicker
              fontSize='xs'
              iconFontSize={14}
              showIconOnlyIfEmpty
              value={goal.startDate}
              onChange={handleChangeStartDate}
            />
          </chakra.div>
        </Flex>
        <Flex flexDirection='column' alignItems='flex-start' width='50%'>
          <Text fontSize='xs' lineHeight={4}>
            Target date:
          </Text>
          <chakra.div mt={1}>
            <DatePicker
              fontSize='xs'
              iconFontSize={14}
              showIconOnlyIfEmpty
              value={goal.targetDate}
              onChange={handleChangeTargetDate}
            />
          </chakra.div>
        </Flex>
      </Flex>
    </Box>
  );
});
