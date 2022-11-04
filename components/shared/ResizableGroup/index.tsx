import { observer } from 'mobx-react-lite';
import { ResizableGroupView } from './view';
import { ResizableGroupProps, ResizableGroupStoreProvider } from './store';

export const ResizableGroup = observer(function ResizableGroup(props: ResizableGroupProps) {
  return (
    <ResizableGroupStoreProvider {...props}>
      <ResizableGroupView {...props}/>
    </ResizableGroupStoreProvider>
  );
});
