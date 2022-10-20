import { observer } from 'mobx-react-lite';
import { DraggableListView } from './view';
import {
  DraggableListComponentProps,
  DraggableListProps,
  DraggableListStore,
  DraggableListStoreProvider,
} from './store';

export const DraggableList = observer(function DraggableList(
  props: DraggableListProps &
    DraggableListComponentProps & { instance?: DraggableListStore }
) {
  return (
    <DraggableListStoreProvider {...props}>
      <DraggableListView {...props} />
    </DraggableListStoreProvider>
  );
});
