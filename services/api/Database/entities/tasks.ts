import { TaskData } from '../../../../components/shared/TasksList/types';
import { DB } from '../index';

const data = {
  get: {
    '/api/tasks': async (
      db: DB,
      {
        id,
        filter,
      }: {
        id: string;
        filter?: {
          inputId?: string;
        };
      }
    ) => {
      const tasks = await db.getAll('tasks');
      const taskLists = await db.get('taskLists', id);

      if (!taskLists) {
        await db.add('taskLists', { id, taskIds: [] });

        return {
          tasks: {},
          order: [],
        };
      }

      const filteredTasks = tasks
        .filter(({ listId, input }) => {
          if (listId !== id) {
            return false;
          }

          if (filter?.inputId && input?.id !== filter.inputId) {
            return false;
          }

          return true;
        })
        .reduce((acc, task) => {
          acc[task.id] = task;
          return acc;
        }, {});

      return {
        tasks: filteredTasks,
        order: taskLists.taskIds.filter((taskId) => filteredTasks[taskId]),
      };
    },
  },
  post: {
    '/api/tasks/create': async (
      db: DB,
      data: { task: TaskData; placement: 'top' | 'bottom' }
    ) => {
      await db.add('tasks', data.task);
      const taskLists = await db.get('taskLists', data.task.listId);

      if (taskLists) {
        if (data.placement === 'top') {
          taskLists.taskIds.unshift(data.task.id);
        } else {
          taskLists.taskIds.push(data.task.id);
        }

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
