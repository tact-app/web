import { observer } from 'mobx-react-lite';
import { ResizableBlocksView } from './view';
import {
  ResizableBlocksProps,
  ResizableBlocksStore,
  ResizableBlocksStoreProvider,
} from './store';
import { PropsWithChildren } from 'react';

export const ResizableBlocks = observer(function ResizableBlocks(
  props: PropsWithChildren<ResizableBlocksProps> & {
    instance?: ResizableBlocksStore;
  }
) {
  return (
    <ResizableBlocksStoreProvider {...props}>
      <ResizableBlocksView>{props.children}</ResizableBlocksView>
    </ResizableBlocksStoreProvider>
  );
});
