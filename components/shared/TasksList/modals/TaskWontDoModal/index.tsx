import { observer } from 'mobx-react-lite';
import { TaskWontDoModalView } from './view';
import { TaskWontDoModalProps, TaskWontDoModalStoreProvider } from './store';

export const TaskWontDoModal = observer(function TaskWontDoModal(props: TaskWontDoModalProps) {
  return (
    <TaskWontDoModalStoreProvider {...props}>
      <TaskWontDoModalView {...props}/>
    </TaskWontDoModalStoreProvider>
  );
});
