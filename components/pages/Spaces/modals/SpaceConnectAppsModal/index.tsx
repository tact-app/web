import { observer } from 'mobx-react-lite';
import { ConnectAppsModal } from './view';
import {
  SpaceConnectAppsModalProps,
  SpaceConnectAppsModalStoreProvider,
} from './store';

export const SpaceConnectAppsModal = observer(function SpaceCreationModal(
  props: SpaceConnectAppsModalProps
) {
  return (
    <SpaceConnectAppsModalStoreProvider {...props}>
      <ConnectAppsModal />
    </SpaceConnectAppsModalStoreProvider>
  );
});
