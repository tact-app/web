import { observer } from 'mobx-react-lite';
import { TasksStoreProvider } from './store';
import { TasksView } from './view';

const TasksPage = observer(function TasksPage() {
  return (
    <TasksStoreProvider>
      <TasksView/>
    </TasksStoreProvider>
  );
});

export default TasksPage;
