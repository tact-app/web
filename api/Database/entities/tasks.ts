import { TaskData } from '../../../components/pages/Inbox/types';
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
    '/api/tasks/delete': async (db: DB, { ids, listId }: { ids: string[], listId: string }) => {
      console.log(ids)
      await Promise.all(ids.map((id) => db.delete('tasks', id)));

      const existedList = await db.get('tasksLists', listId);

      if (existedList) {
        existedList.taskIds = existedList.taskIds.filter((id) => !ids.includes(id));

        await db.put('tasksLists', existedList);
      }
    },
    '/api/tasks/order': async (db: DB, data: { listId: string, taskIds: string[], destination: number }) => {
      const existedList = await db.get('tasksLists', data.listId);

      if (existedList) {
        existedList.taskIds = existedList.taskIds.filter((id) => !data.taskIds.includes(id));
        existedList.taskIds.splice(data.destination, 0, ...data.taskIds);

        await db.put('tasksLists', existedList);
      }
    },
    '/api/tasks/update': async (db: DB, data: { id: string, fields: Partial<TaskData> }) => {
      const existedTask = await db.get('tasks', data.id);

      if (existedTask) {
        Object.entries(data.fields).forEach(([key, value]) => {
          existedTask[key] = value;
        });

        console.log(data, existedTask)
        await db.put('tasks', existedTask);
      }
    },
  }
};

export default data;
