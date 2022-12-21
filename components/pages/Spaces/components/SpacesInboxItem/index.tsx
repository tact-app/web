import { observer } from 'mobx-react-lite';
import { SpacesInboxItemView } from './view';
import { SpacesInboxItemProps, SpacesInboxItemStoreProvider } from './store';

export const SpacesInboxItem = observer(function SpacesInboxItem(
  props: SpacesInboxItemProps
) {
  return (
    <SpacesInboxItemStoreProvider {...props}>
      <SpacesInboxItemView {...props} />
    </SpacesInboxItemStoreProvider>
  );
});
