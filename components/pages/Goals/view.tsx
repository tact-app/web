import React from 'react';
import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import { GoalList } from './components/GoalsList';
import { ModalsSwitcher } from '../../../helpers/ModalsController';
import { useGoalsStore } from './store';
import { useHotkeysHandler } from "../../../helpers/useHotkeysHandler";
import { Box, Heading } from "@chakra-ui/react";
import { GoalCreateNewButton } from "./components/GoalCreateNewButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import { EmptyGoalListMessage } from "./components/EmptyGoalListMessage/EmptyGoalListMessage";

export const GoalsView = observer(function GoalsView() {
  const store = useGoalsStore();

  useHotkeysHandler(store.keymap, store.hotkeysHandlers, {
    enabled: !store.modals.isOpen,
    keyup: true,
  });

  return (
    <>
      <Head>
        <title>Goals</title>
      </Head>
      <Box pl={32} pr={32}>
        <Heading
          size='md'
          fontSize='2xl'
          mt={0}
          mb={0}
          pt={4}
          pb={10}
          textAlign={store.hasGoals ? 'left' : 'center'}
        >
          Goals
        </Heading>

        {store.hasGoals ? (
          <GoalList
            listBySpaces={store.list}
            onCloneGoal={store.cloneGoal}
            onDeleteGoal={store.deleteGoal}
            onOpenGoal={store.editGoal}
            onUpdateGoal={store.updateGoal}
            onWontDo={store.wontDoSubmitModalOpen}
          />
        ) : (
          <EmptyGoalListMessage onCreate={store.startGoalCreation} />
        )}

        {store.hasGoals && (
          <GoalCreateNewButton
            withHotkey
            withTooltip
            borderRadius='full'
            w={12}
            h={12}
            position='absolute'
            bottom={6}
            right={6}
            mb={0}
            onClick={store.startGoalCreation}
          >
            <FontAwesomeIcon icon={faPlus} fontSize={18} />
          </GoalCreateNewButton>
        )}
      </Box>
      <ModalsSwitcher controller={store.modals} />
    </>
  );
});
