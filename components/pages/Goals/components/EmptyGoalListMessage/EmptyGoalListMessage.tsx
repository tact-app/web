import { Flex, Text } from '@chakra-ui/react';
import { MascotGoals } from '../../../../images/illustrations/MascotGoals';
import { GoalCreateNewButton } from "../GoalCreateNewButton";
import React from "react";

type Props = {
  onCreate(): void;
}

export function EmptyGoalListMessage({ onCreate }: Props) {
  return (
    <Flex
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      maxW={500}
      margin='auto'
      pt={10}
    >
      <MascotGoals width={336} />
      <Text
        fontSize='sm'
        fontWeight='normal'
        color='gray.700'
        textAlign='center'
        mt={4}
        mb={6}
        lineHeight={5}
      >
        You can define a meaningful destination point that will
        help you focus and&nbsp;complete only essential things that
        bring you closer to it, postponing or&nbsp;canceling the rest.
      </Text>
      <GoalCreateNewButton onClick={onCreate} withHotkey>
        Create new goal 🎯
      </GoalCreateNewButton>
    </Flex>
  );
}
