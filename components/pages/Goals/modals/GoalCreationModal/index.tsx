import { observer } from 'mobx-react-lite';
import { GoalCreationModalView } from './view';
import { GoalCreationModalProps, GoalCreationModalStoreProvider } from './store';

export const GoalCreationModal = observer(function GoalCreationModal(props: GoalCreationModalProps) {
  return (
    <GoalCreationModalStoreProvider {...props}>
      <GoalCreationModalView/>
    </GoalCreationModalStoreProvider>
  );
});
