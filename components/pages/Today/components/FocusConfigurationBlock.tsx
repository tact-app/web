import { observer } from 'mobx-react-lite';
import { chakra } from '@chakra-ui/react';
import { FocusConfiguration } from './FocusConfiguration';
import React from 'react';
import { useTodayStore } from '../store';

export const FocusConfigurationBlock = observer(
  function FocusConfigurationBlock() {
    const store = useTodayStore();

    return (
      <chakra.div h='100%'>
        {store.isFocusModeActive && !store.isSilentFocusMode ? (
          <FocusConfiguration
            instance={store.focusConfiguration}
            callbacks={store.focusConfigurationCallbacks}
            getItemsCount={store.getItemsCount}
          />
        ) : null}
      </chakra.div>
    );
  }
);
