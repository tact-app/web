import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import TaskList from './components/TaskList';
import { TasksStoreProvider } from './store';

const TasksPage = observer(function TasksPage() {
  return (
    <TasksStoreProvider>
      <Head>
        <title>Task list</title>
      </Head>
      <TaskList/>
    </TasksStoreProvider>
  );
});

export default TasksPage;