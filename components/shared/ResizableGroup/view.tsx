import { observer } from 'mobx-react-lite';
import { ResizableGroupProps, useResizableGroupStore } from './store';
import { chakra } from '@chakra-ui/react';
import useResizeObserver from 'use-resize-observer';
import React, { useEffect } from 'react';

export const ResizableGroupView = observer(function ResizableGroupView(
  props: ResizableGroupProps
) {
  const store = useResizableGroupStore();
  const { ref, width } = useResizeObserver();

  useEffect(() => {
    store.setContainerWidth(width || 0);
  }, [width, store]);

  return (
    <chakra.div
      ref={ref}
      display='flex'
      flex={1}
      overflow='hidden'
      width='100%'
    >
      {props.children}
    </chakra.div>
  );
});
