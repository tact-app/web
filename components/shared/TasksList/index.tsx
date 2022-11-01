import { observer } from 'mobx-react-lite';
import {
  TasksListProps,
  TasksListStore,
  TasksListStoreProvider,
} from './store';
import { TasksListView } from './view';

const TasksList = observer(function TasksList(
  props: TasksListProps & {
    instance?: TasksListStore;
  }
) {
  return (
    <TasksListStoreProvider {...props}>
      <TasksListView />
    </TasksListStoreProvider>
  );
});

export default TasksList;
