import { observer } from 'mobx-react-lite';
import { SpacesInboxView } from './view';
import { SpacesInboxProps, SpacesInboxStoreProvider } from './store';

export const SpacesInbox = observer(function SpacesInbox(props: SpacesInboxProps) {
  return (
    <SpacesInboxStoreProvider {...props}>
      <SpacesInboxView {...props}/>
    </SpacesInboxStoreProvider>
  );
});
