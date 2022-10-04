import { TaskData } from '../../../components/pages/Inbox/store/types';

const taskList: TaskData[] = [];

const data = {
  'get': {
    '/api/tasks': () => taskList,
  },
  'post': {

  }
};

export default data;