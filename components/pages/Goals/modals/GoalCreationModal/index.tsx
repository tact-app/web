import { observer } from 'mobx-react-lite';
import { GoalCreationModalView } from './view';
import { GoalCreationModalStoreProvider } from './store';
import { GoalCreationModalProps } from './types';

export const GoalCreationModal = observer(function GoalCreationModal(
  props: GoalCreationModalProps
) {
  return (
    <GoalCreationModalStoreProvider {...props}>
      <GoalCreationModalView />
    </GoalCreationModalStoreProvider>
  );
});
