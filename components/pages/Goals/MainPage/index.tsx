import React from 'react';
import { observer } from 'mobx-react-lite';
import { GoalsStoreProvider } from './store';
import { GoalsView } from './view';

const GoalsPage = observer(function GoalsPage() {
  return (
    <GoalsStoreProvider>
      <GoalsView />
    </GoalsStoreProvider>
  );
});

export default GoalsPage;
