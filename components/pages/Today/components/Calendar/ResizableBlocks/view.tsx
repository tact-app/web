import { observer } from 'mobx-react-lite';
import { ResizableBlocksProps, useResizableBlocksStore } from './store';
import { Box } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import { useHotkeysHandler } from '../../../../../../helpers/useHotkeysHandler';

export const ResizableBlocksView = observer(function ResizableBlocksView(
  props: PropsWithChildren<ResizableBlocksProps>
) {
  const store = useResizableBlocksStore();

  useHotkeysHandler(store.navigation.keyMap, store.navigation.hotkeyHandlers);

  console.log(store.navigation.keyMap);

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
