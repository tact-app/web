import { observer } from 'mobx-react-lite';
import { Box, Button, Heading, Text, Flex } from '@chakra-ui/react';
import { useGoalsStore } from '../../store';
import { GoalCreateNewButton } from '../GoalCreateNewButton';
import React from 'react';
import { GoalItem } from '../GoalItem';
import ImageComponent from "../../../../shared/Image";
import { HotkeyBlock } from "../../../../shared/HotkeyBlock";
import mascotGoals from '../../../../../assets/images/mascot-goals.png';
import { useHotkeysHandler } from "../../../../../helpers/useHotkeysHandler";

export const GoalsList = observer(function GoalsList() {
  const store = useGoalsStore();

  useHotkeysHandler(store.keymap, store.hotkeysHandlers, {
    enabled: !store.modals.isOpen
  });

  return (
    <Box pl={32} pr={32}>
      <Heading
        textAlign={store.root.resources.goals.haveGoals ? 'initial' : 'center'}
        size='md'
        mt={2.5}
        mb={8}
        pt={4}
      >
        Goals
      </Heading>
      <Box>
        {store.root.resources.goals.haveGoals
          ? [
              <GoalCreateNewButton key='create-new-goal' />,
              store.root.resources.goals.order.map((goalId) => (
                <GoalItem key={goalId} id={goalId} />
              ))
            ]
          : (
            <Flex
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              maxW={500}
              margin='auto'
              pt={10}
            >
              <ImageComponent src={mascotGoals} width={336} />
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
              <Button
                onClick={store.startGoalCreation}
                size='md'
                minH={8}
                mb={2}
                bg='blue.400'
                color='white'
                _hover={{
                  bg: 'blue.500',
                }}
                _focus={{
                  boxShadow: 'var(--chakra-shadows-outline)',
                  outline: 'none',
                }}
              >
                Create new goal 🎯
              </Button>
              <Text
                fontSize='xs'
                fontWeight='normal'
                lineHeight={4}
                color='gray.400'
                display='flex'
                justifyContent='center'
              >
                Press
                <HotkeyBlock hotkey='N' ml={1} fontSize='xs' lineHeight={4} />
              </Text>
            </Flex>
          )}
      </Box>
    </Box>
  );
});
