import { observer } from 'mobx-react-lite';
import { ResizableBlocksView } from './view';
import { ResizableBlocksProps, ResizableBlocksStoreProvider } from './store';
import { PropsWithChildren } from 'react';

export const ResizableBlocks = observer(function ResizableBlocks(
  props: PropsWithChildren<ResizableBlocksProps>
) {
  return (
    <ResizableBlocksStoreProvider {...props}>
      <ResizableBlocksView {...props} />
    </ResizableBlocksStoreProvider>
  );
});
