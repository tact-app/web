import { TaskData, TaskStatus } from '../../../components/pages/Inbox/store/types';
import { DB } from '../index';

const data = {
  'get': {
    '/api/tasks': (db: DB) => db.getAll('tasks').then((tasks) => tasks.sort((a, b) => a.index - b.index)),
  },
  'post': {
    '/api/tasks/create': (db: DB, data: TaskData) => db.add('tasks', data),
    '/api/tasks/order': async (db: DB, data: { id: string, index: number }) => {
      const existedTask = await db.get('tasks', data.id);

      if (existedTask) {
        existedTask.index = data.index;
        await db.put('tasks', existedTask);
      }
    },
    '/api/tasks/status': async (db: DB, data: { id: string, status: TaskStatus }) => {
      const existedTask = await db.get('tasks', data.id);

      if (existedTask) {
        existedTask.status = data.status;
        await db.put('tasks', existedTask);
      }
    },
  }
};

export default data;