import { observer } from 'mobx-react-lite';
import { TaskInputProps, TaskInputStoreProvider } from './store';
import { TaskInputView } from './view';

export const TaskInput = observer(function TaskInput(props: TaskInputProps) {
  return (
    <TaskInputStoreProvider {...props}>
      <TaskInputView/>
    </TaskInputStoreProvider>
  );
});