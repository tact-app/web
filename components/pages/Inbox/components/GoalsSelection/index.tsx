import { observer } from 'mobx-react-lite';
import { GoalsSelectionView } from './view';
import { GoalsSelectionProps, GoalsSelectionStoreProvider } from './store';

export const GoalsSelection = observer(function GoalsSelection(
  props: GoalsSelectionProps
) {
  return (
    <GoalsSelectionStoreProvider {...props}>
      <GoalsSelectionView />
    </GoalsSelectionStoreProvider>
  );
});
