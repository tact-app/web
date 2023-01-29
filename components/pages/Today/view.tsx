import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Head from 'next/head';

import 'allotment/dist/style.css';
import { useHotkeysHandler } from '../../../helpers/useHotkeysHandler';
import { Box } from '@chakra-ui/react';
import { useTodayStore } from './store';
import { ResizableGroup } from '../../shared/ResizableGroup';
import { ResizableGroupChild } from '../../shared/ResizableGroup/ResizableGroupChild';
import { ListsBlock } from './components/ListsBlock';
import { FocusConfigurationBlock } from './components/FocusConfigurationBlock';
import { TaskBlock } from './components/TaskBlock';
import { CalendarBlock } from './components/CalendarBlock';

export const TodayView = observer(function TodayView() {
  const store = useTodayStore();

  useHotkeysHandler(store.keyMap, store.hotkeyHandlers, {
    enabled: store.isHotkeysEnabled,
  });

  useEffect(() => {
    if (store.shouldSetFirstFocus) {
      store.setFirstFocus();
    }
  }, [store, store.shouldSetFirstFocus]);

  return (
    <>
      <Head>
        <title>Today</title>
      </Head>
      <Box display='flex' h='100%'>
        <ResizableGroup>
          <ResizableGroupChild
            index={0}
            config={store.resizableConfig[0]}
            borderRight='1px'
            borderColor='gray.100'
          >
            <FocusConfigurationBlock />
          </ResizableGroupChild>
          <ResizableGroupChild index={1} config={{ ...store.resizableConfig[1], onMinWidth: store.openFullScreenCalendar }}>
            <ListsBlock />
          </ResizableGroupChild>
          <ResizableGroupChild
            index={2}
            config={store.resizableConfig[2]}
            boxShadow='lg'
            onMouseDown={store.handleTaskMouseDown}
          >
            <TaskBlock />
          </ResizableGroupChild>
          <ResizableGroupChild index={3} config={{ ...store.resizableConfig[3], onMinWidth: store.collapseCalendar }}>
            <CalendarBlock />
          </ResizableGroupChild>
        </ResizableGroup>
      </Box>
    </>
  );
});
