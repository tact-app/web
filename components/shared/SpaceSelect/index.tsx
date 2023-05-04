import React from 'react';
import { observer } from 'mobx-react-lite';
import { SpaceSelectProps, SpaceSelectStoreProvider } from './store';
import { SpaceSelectView } from './view';

export const SpaceSelect = observer(function SpaceSelect(props: SpaceSelectProps) {
  return (
    <SpaceSelectStoreProvider {...props}>
      <SpaceSelectView />
    </SpaceSelectStoreProvider>
  );
});
