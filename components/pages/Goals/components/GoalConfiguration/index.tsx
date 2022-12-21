import { observer } from 'mobx-react-lite';
import {
  GoalConfigurationProps,
  GoalConfigurationStoreProvider,
} from './store';
import { GoalConfigurationView } from './view';

export const GoalConfiguration = observer(function GoalConfiguration(
  props: GoalConfigurationProps
) {
  return (
    <GoalConfigurationStoreProvider {...props}>
      <GoalConfigurationView />
    </GoalConfigurationStoreProvider>
  );
});
