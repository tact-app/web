import { observer } from 'mobx-react-lite';
import {
  TaskQuickEditorProps,
  TaskQuickEditorStoreProvider,
} from '../TaskQuickEditor/store';
import { TaskCreatorView } from './view';
import { useTasksStore } from '../../store';

const useTasksStoreInstance = () => useTasksStore().creator;

export const TaskCreator = observer(function TaskCreator(
  props: TaskQuickEditorProps
) {
  return (
    <TaskQuickEditorStoreProvider
      {...props}
      useInstance={useTasksStoreInstance}
    >
      <TaskCreatorView />
    </TaskQuickEditorStoreProvider>
  );
});
