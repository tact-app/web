import { observer } from 'mobx-react-lite';
import { FocusConfigurationView } from './view';
import { FocusConfigurationProps, FocusConfigurationStoreProvider } from './store';

export const FocusConfiguration = observer(function FocusConfiguration(props: FocusConfigurationProps) {
  return (
    <FocusConfigurationStoreProvider {...props}>
      <FocusConfigurationView {...props}/>
    </FocusConfigurationStoreProvider>
  );
});
