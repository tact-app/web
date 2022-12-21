import { observer } from 'mobx-react-lite';
import { SpaceCreationModalView } from './view';
import {
  SpaceCreationModalProps,
  SpaceCreationModalStoreProvider,
} from './store';

export const SpaceCreationModal = observer(function SpaceCreationModal(
  props: SpaceCreationModalProps
) {
  return (
    <SpaceCreationModalStoreProvider {...props}>
      <SpaceCreationModalView />
    </SpaceCreationModalStoreProvider>
  );
});
