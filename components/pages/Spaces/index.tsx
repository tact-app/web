import { observer } from 'mobx-react-lite';
import { SpacesView } from './view';
import { SpacesProps, SpacesStoreProvider } from './store';

const Spaces = observer(function Spaces(props: SpacesProps) {
  return (
    <SpacesStoreProvider {...props}>
      <SpacesView {...props} />
    </SpacesStoreProvider>
  );
});

export default Spaces;
