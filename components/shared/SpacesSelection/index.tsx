import { observer } from 'mobx-react-lite';
import { SpaceSelectionView } from './view';
import { SpacesSelectionProps, SpacesSelectionStoreProvider } from './store';

export const SpacesSelection = observer(function GoalsSelection(
  props: SpacesSelectionProps
) {
  return (
    <SpacesSelectionStoreProvider {...props}>
      <SpaceSelectionView {...props} />
    </SpacesSelectionStoreProvider>
  );
});
