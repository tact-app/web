import { observer } from 'mobx-react-lite';
import { SpacesMenuView } from './view';
import {
  SpacesMenuProps,
  SpacesMenuStore,
  SpacesMenuStoreProvider,
} from './store';

export const SpacesMenu = observer(function SpacesMenu(
  props: SpacesMenuProps & { instance?: SpacesMenuStore }
) {
  return (
    <SpacesMenuStoreProvider {...props}>
      <SpacesMenuView {...props} />
    </SpacesMenuStoreProvider>
  );
});
