import { observer } from 'mobx-react-lite';
import { TaskPriorityModalView } from './view';
import {
  TaskPriorityModalProps,
  TaskPriorityModalStoreProvider,
} from './store';

export const TaskPriorityModal = observer(function TaskPriorityModal(
  props: TaskPriorityModalProps
) {
  return (
    <TaskPriorityModalStoreProvider {...props}>
      <TaskPriorityModalView {...props} />
    </TaskPriorityModalStoreProvider>
  );
});
