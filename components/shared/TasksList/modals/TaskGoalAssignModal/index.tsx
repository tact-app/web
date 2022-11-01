import { observer } from 'mobx-react-lite';
import { TaskGoalAssignModalView } from './view';
import {
  TaskGoalAssignModalProps,
  TaskGoalAssignModalStoreProvider,
} from './store';
import { GoalData } from '../../../../pages/Goals/types';

export const TaskGoalAssignModal = observer(function TaskGoalAssignModal(
  props: TaskGoalAssignModalProps & { goals: GoalData[] }
) {
  return (
    <TaskGoalAssignModalStoreProvider {...props}>
      <TaskGoalAssignModalView {...props} />
    </TaskGoalAssignModalStoreProvider>
  );
});
