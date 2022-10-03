import { observer } from 'mobx-react-lite';
import { useTasksStore } from '../../store';
import TaskItem from '../TaskItem';

const TaskList = observer(function TaskList() {
  const store = useTasksStore();

  return (
    <div>
      {store.items.map((task) => <TaskItem key={task.id} item={task}/>)}
    </div>
  );
});

export default TaskList;