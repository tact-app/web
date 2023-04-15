import React from 'react';
import { observer } from 'mobx-react-lite';
import { GoalsArchiveStoreProvider } from './store';
import { GoalsArchiveView } from './view';

const GoalsArchivePage = observer(function GoalsArchivePage() {
  return (
    <GoalsArchiveStoreProvider>
      <GoalsArchiveView />
    </GoalsArchiveStoreProvider>
  );
});

export default GoalsArchivePage;
