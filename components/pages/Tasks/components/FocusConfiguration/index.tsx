import { observer } from 'mobx-react-lite';
import { FocusConfigurationView } from './view';
import {
  FocusConfigurationProps,
  FocusConfigurationStore,
  FocusConfigurationStoreProvider,
} from './store';

export const FocusConfiguration = observer(function FocusConfiguration(
  props: FocusConfigurationProps & { instance: FocusConfigurationStore }
) {
  return (
    <FocusConfigurationStoreProvider {...props}>
      <FocusConfigurationView {...props} />
    </FocusConfigurationStoreProvider>
  );
});
