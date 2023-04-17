import { observer } from 'mobx-react-lite';
import { TaskAddTagModalView } from './view';
import { TaskAddTagModalProps, TaskAddTagModalStoreProvider } from './store';

export const TaskAddTagModal = observer(function TaskAddTagModal(props: TaskAddTagModalProps) {
  return (
    <TaskAddTagModalStoreProvider {...props}>
      <TaskAddTagModalView {...props}/>
    </TaskAddTagModalStoreProvider>
  );
});
