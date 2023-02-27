import React from 'react';
import { observer } from 'mobx-react-lite';
import { PropertyMenuProps, PropertyMenuStoreProvider } from './store';
import { PropertyMenuView } from './view';

export const PropertyMenu = observer(function PropertyMenu(props: PropertyMenuProps) {
  return (
    <PropertyMenuStoreProvider {...props}>
      <PropertyMenuView />
    </PropertyMenuStoreProvider>
  );
});
