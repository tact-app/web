import { observer } from 'mobx-react-lite';
import { TasksListWithCreatorView } from './view';
import {
  TasksListWithCreatorProps,
  TasksListWithCreatorStore,
  TasksListWithCreatorStoreProvider,
} from './store';

export const TasksListWithCreator = observer(function TasksListWithCreator(
  props: TasksListWithCreatorProps & { instance?: TasksListWithCreatorStore }
) {
  return (
    <TasksListWithCreatorStoreProvider {...props}>
      <TasksListWithCreatorView {...props} />
    </TasksListWithCreatorStoreProvider>
  );
});
