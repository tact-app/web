import { observer } from 'mobx-react-lite';
import { DraggableListView } from './view';
import {
  DraggableListComponentProps,
  DraggableListProps,
  DraggableListStore,
  DraggableListStoreProvider,
} from './store';
import { BoxProps } from '@chakra-ui/react';

export const DraggableList = observer(function DraggableList(
  props: DraggableListProps &
    DraggableListComponentProps & { instance?: DraggableListStore } & {
      boxProps?: BoxProps;
      wrapperProps?: BoxProps;
    }
) {
  return (
    <DraggableListStoreProvider {...props}>
      <DraggableListView {...props} />
    </DraggableListStoreProvider>
  );
});
