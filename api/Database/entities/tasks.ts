import { TaskData } from '../../../components/pages/Inbox/types';
import { DB } from '../index';

const data = {
  get: {
    '/api/tasks': async (db: DB, { id }: { id: string }) => {
      const tasks = await db.getAll('tasks');
      const taskLists = await db.get('taskLists', id);

      if (!taskLists) {
        await db.add('taskLists', { id, taskIds: [] });

        return {
          tasks: [],
          order: [],
        };
      }

      return {
        tasks: tasks
          .filter(({ listId }) => listId === id)
          .reduce((acc, task) => {
            acc[task.id] = task;
            return acc;
          }, {}),
        order: taskLists.taskIds,
      };
    },
  },
  post: {
    '/api/tasks/create': async (db: DB, data: TaskData) => {
      await db.add('tasks', data);
      const taskLists = await db.get('taskLists', data.listId);

      if (taskLists) {
        taskLists.taskIds.push(data.id);

        await db.put('taskLists', taskLists);
      }
    },
  },
  delete: {
    '/api/tasks/delete': async (
      db: DB,
      { ids, listId }: { ids: string[]; listId: string }
    ) => {
      await Promise.all(ids.map((id) => db.delete('tasks', id)));

      const existedList = await db.get('taskLists', listId);

      if (existedList) {
        existedList.taskIds = existedList.taskIds.filter(
          (id) => !ids.includes(id)
        );

        await db.put('taskLists', existedList);
      }
    },
  },
  put: {
    '/api/tasks/order': async (
      db: DB,
      data: { listId: string; taskIds: string[]; destination: number }
    ) => {
      const existedList = await db.get('taskLists', data.listId);

      if (existedList) {
        existedList.taskIds = existedList.taskIds.filter(
          (id) => !data.taskIds.includes(id)
        );
        existedList.taskIds.splice(data.destination, 0, ...data.taskIds);

        await db.put('taskLists', existedList);
      }
    },
    '/api/tasks/update': async (
      db: DB,
      data: { id: string; fields: Partial<TaskData> }
    ) => {
      const existedTask = await db.get('tasks', data.id);

      if (existedTask) {
        Object.entries(data.fields).forEach(([key, value]) => {
          existedTask[key] = value;
        });

        await db.put('tasks', existedTask);
      }
    },
    '/api/tasks/assign-goal': async (
      db: DB,
      data: { taskIds: string[]; goalId: string | null }
    ) => {
      await Promise.all(
        data.taskIds.map(async (id) => {
          const existedTask = await db.get('tasks', id);

          if (existedTask) {
            existedTask.goalId = data.goalId;

            await db.put('tasks', existedTask);
          }
        })
      );
    },
  },
};

export default data;
