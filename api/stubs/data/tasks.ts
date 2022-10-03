import { TaskData } from '../../../components/pages/Tasks/store/types';

const taskList: TaskData[] = [{
  id: 1,
  title: 'Task 1',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  status: 'todo',
  priority: 'low',
  assignee: 1,
  createdAt: 1588888888,
  updatedAt: 1588888888,
}, {
  id: 2,
  title: 'Task 2',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  status: 'todo',
  priority: 'low',
  assignee: 1,
  createdAt: 1588888888,
  updatedAt: 1588888888,
}, {
  id: 3,
  title: 'Task 3',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  status: 'todo',
  priority: 'low',
  assignee: 1,
  createdAt: 1588888888,
  updatedAt: 1588888888,
}];

const data = {
  'get': {
    '/api/tasks': () => taskList,
  },
  'post': {

  }
};

export default data;