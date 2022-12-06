import { observer } from 'mobx-react-lite';
import { ResizableBlocksProps, useResizableBlocksStore } from './store';
import { Box } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export const ResizableBlocksView = observer(function ResizableBlocksView(
  props: PropsWithChildren<ResizableBlocksProps>
) {
  const store = useResizableBlocksStore();

  return (
    <Box
      ref={store.setWrapperRef}
      position='relative'
      display='flex'
      overflow='auto'
      css={{
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
      cursor={store.cursor}
    >
      {props.children}
    </Box>
  );
});
