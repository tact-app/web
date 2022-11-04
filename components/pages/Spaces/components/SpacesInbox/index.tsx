import { observer } from 'mobx-react-lite';
import { SpacesInboxView } from './view';
import {
  SpacesInboxProps,
  SpacesInboxStore,
  SpacesInboxStoreProvider,
} from './store';

export const SpacesInbox = observer(function SpacesInbox(
  props: SpacesInboxProps & { instance: SpacesInboxStore }
) {
  return (
    <SpacesInboxStoreProvider {...props}>
      <SpacesInboxView {...props} />
    </SpacesInboxStoreProvider>
  );
});
