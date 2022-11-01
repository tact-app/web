import { observer } from 'mobx-react-lite';
import {
  TaskQuickEditorProps,
  TaskQuickEditorStoreProvider,
} from '../TaskQuickEditor/store';
import { TaskCreatorProps, TaskCreatorView } from './view';
import { useTasksListStore } from '../../store';

const useTasksStoreInstance = () => useTasksListStore().creator;

export const TaskCreator = observer(function TaskCreator(
  props: TaskQuickEditorProps & TaskCreatorProps
) {
  return (
    <TaskQuickEditorStoreProvider
      {...props}
      useInstance={useTasksStoreInstance}
    >
      <TaskCreatorView {...props} />
    </TaskQuickEditorStoreProvider>
  );
});
