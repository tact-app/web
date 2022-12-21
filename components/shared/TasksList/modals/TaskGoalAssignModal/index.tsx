import { observer } from 'mobx-react-lite';
import { TaskGoalAssignModalView } from './view';
import {
  TaskGoalAssignModalProps,
  TaskGoalAssignModalStoreProvider,
} from './store';

export const TaskGoalAssignModal = observer(function TaskGoalAssignModal(
  props: TaskGoalAssignModalProps
) {
  return (
    <TaskGoalAssignModalStoreProvider {...props}>
      <TaskGoalAssignModalView {...props} />
    </TaskGoalAssignModalStoreProvider>
  );
});
