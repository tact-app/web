import { observer } from 'mobx-react-lite';
import { TaskSpaceChangeModalView } from './view';
import {
  TaskSpaceChangeModalProps,
  TaskSpaceChangeModalStoreProvider,
} from './store';

export const TaskSpaceChangeModal = observer(function TaskSpaceChangeModal(
  props: TaskSpaceChangeModalProps
) {
  return (
    <TaskSpaceChangeModalStoreProvider {...props}>
      <TaskSpaceChangeModalView {...props} />
    </TaskSpaceChangeModalStoreProvider>
  );
});
