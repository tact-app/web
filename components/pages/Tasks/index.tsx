import { observer } from 'mobx-react-lite';
import { TasksView } from './view';
import { TasksStoreProvider } from './store';

const TasksPage = observer(function TasksPage() {
  return (
    <TasksStoreProvider>
      <TasksView />
    </TasksStoreProvider>
  );
});

export default TasksPage;
