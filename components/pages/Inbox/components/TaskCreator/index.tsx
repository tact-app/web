import { observer } from 'mobx-react-lite';
import { TaskQuickEditorProps, TaskQuickEditorStoreProvider } from '../TaskQuickEditor/store';
import { TaskCreatorView } from './view';
import { useTasksStore } from '../../store';

export const TaskCreator = observer(function TaskCreator(props: TaskQuickEditorProps) {
  return (
    <TaskQuickEditorStoreProvider {...props} instance={() => useTasksStore().creator}>
      <TaskCreatorView/>
    </TaskQuickEditorStoreProvider>
  );
});