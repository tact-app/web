import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { TaskDescriptionStoreProvider } from './store';

export const TaskDescription = observer(function TaskDescription() {
  const ref = useRef<null | HTMLDivElement>(null);

  return (
    <TaskDescriptionStoreProvider ref={ref.current}>
      <div ref={ref}/>
    </TaskDescriptionStoreProvider>
  );
});
