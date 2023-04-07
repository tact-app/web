import React from 'react';
import { observer } from 'mobx-react-lite';
import { GoalWontDoSubmitModalProps, GoalWontDoSubmitModalStoreProvider } from './store';
import { GoalWontDoSubmitModalView } from './view';

export const GoalWontDoSubmitModal = observer(function GoalWontDoSubmitModal(
  props: GoalWontDoSubmitModalProps
) {
  return (
    <GoalWontDoSubmitModalStoreProvider {...props}>
      <GoalWontDoSubmitModalView />
    </GoalWontDoSubmitModalStoreProvider>
  );
});
