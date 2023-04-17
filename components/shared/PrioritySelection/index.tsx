import { observer } from 'mobx-react-lite';
import { PrioritySelectionView } from './view';
import { PrioritySelectionProps, PrioritySelectionStoreProvider } from './store';

export const PrioritySelection = observer(function GoalsSelection(
  props: PrioritySelectionProps
) {
  return (
    <PrioritySelectionStoreProvider {...props}>
      <PrioritySelectionView {...props} />
    </PrioritySelectionStoreProvider>
  );
});
