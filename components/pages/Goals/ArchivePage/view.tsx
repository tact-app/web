import React from 'react';
import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import { GoalList } from '../components/GoalList';
import { ModalsSwitcher } from '../../../../helpers/ModalsController';
import { useGoalsArchiveStore } from './store';
import { Box, Heading } from "@chakra-ui/react";

export const GoalsArchiveView = observer(function GoalsArchiveView() {
  const store = useGoalsArchiveStore();

  return (
    <>
      <Head>
        <title>Goals Archive</title>
      </Head>
      <Box pl={32} pr={32}>
        <Heading
          size='md'
          fontSize='2xl'
          mt={0}
          mb={0}
          pt={4}
          pb={10}
          textAlign='center'
        >
          Archive
        </Heading>
        <GoalList
          listBySpaces={store.list}
          onDeleteGoal={store.deleteGoal}
          onOpenGoal={store.editGoal}
          onUpdateGoal={store.updateGoal}
          onWontDo={store.wontDoSubmitModalOpen}
        />
      </Box>
      <ModalsSwitcher controller={store.modals} />
    </>
  );
});
