import { TaskData, TaskStatus } from '../../../components/pages/Inbox/store/types';
import { DB } from '../index';

const data = {
  'get': {
    '/api/tasks': async (db: DB, { id }: { id: string }) => {
      const tasks = await db.getAll('tasks');
      const tasksLists = await db.get('tasksLists', id);

      if (!tasksLists) {
        await db.add('tasksLists', { id, taskIds: [] });

        return {
          tasks: [],
          order: [],
        }
      }

      return {
        tasks: tasks
          .filter(({ listId }) => listId === id)
          .reduce((acc, task) => {
            acc[task.id] = task;
            return acc;
          }, {}),
        order: tasksLists.taskIds,
      };
    },
  },
  'post': {
    '/api/tasks/create': async (db: DB, data: TaskData) => {
      await db.add('tasks', data)
      const tasksLists = await db.get('tasksLists', data.listId);

      if (tasksLists) {
        tasksLists.taskIds.push(data.id);

        await db.put('tasksLists', tasksLists);
      }
    },
    '/api/tasks/delete': (db: DB, { id }: { id: string }) => db.delete('tasks', id),
    '/api/tasks/order': async (db: DB, data: { listId: string, source: number, destination: number }) => {
      const existedList = await db.get('tasksLists', data.listId);

      if (existedList) {
        const [removed] = existedList.taskIds.splice(data.source, 1);
        existedList.taskIds.splice(data.destination, 0, removed);

        await db.put('tasksLists', existedList);
      }
    },
    '/api/tasks/update': async (db: DB, data: { id: string, fields: Partial<TaskData> }) => {
      const existedTask = await db.get('tasks', data.id);

      if (existedTask) {
        Object.entries(data.fields).forEach(([key, value]) => {
          existedTask[key] = value;
        });
        await db.put('tasks', existedTask);
      }
    },
  }
};

export default data;