import { observer } from 'mobx-react-lite';
import {
  Modes,
  TaskQuickEditorProps,
  TaskQuickEditorStoreProvider,
} from '../TaskQuickEditor/store';
import { TaskCreatorProps, TaskCreatorView } from './view';
import { useTasksListStore } from '../../store';

const useTasksStoreInstance = () => useTasksListStore().creator;

const modesOrder = [Modes.TAG, Modes.SPACE, Modes.GOAL, Modes.PRIORITY];

export const TaskCreator = observer(function TaskCreator(
  props: TaskQuickEditorProps & TaskCreatorProps
) {
  return (
    <TaskQuickEditorStoreProvider
      {...props}
      order={modesOrder}
      useInstance={useTasksStoreInstance}
    >
      <TaskCreatorView {...props} />
    </TaskQuickEditorStoreProvider>
  );
});
