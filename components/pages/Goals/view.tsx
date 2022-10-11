import React from 'react';
import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import { GoalsList } from './components/GoalsList';
import { ModalsSwitcher } from '../../../helpers/ModalsController';
import { useGoalsStore } from './store';

export const GoalsView = observer(function GoalsView() {
  const store = useGoalsStore();

  return (
    <>
      <Head>
        <title>Goals</title>
      </Head>
      <GoalsList/>
      <ModalsSwitcher controller={store.modals}/>
    </>
  );
});