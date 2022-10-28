import { observer } from 'mobx-react-lite';
import { SpacesMenuView } from './view';
import { SpacesMenuProps, SpacesMenuStoreProvider } from './store';

export const SpacesMenu = observer(function SpacesMenu(props: SpacesMenuProps) {
  return (
    <SpacesMenuStoreProvider {...props}>
      <SpacesMenuView {...props}/>
    </SpacesMenuStoreProvider>
  );
});
