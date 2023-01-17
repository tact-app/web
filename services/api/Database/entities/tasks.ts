import { TaskData } from '../../../../components/shared/TasksList/types';
import { DB } from '../index';
import { Lists } from '../../../../components/shared/TasksList/constants';

const updateList = async (
  db: DB,
  id: string,
  cb: (list: {
    id: string;
    taskIds: string[];
  }) =>
    | Promise<{ id: string; taskIds: string[] }>
    | { id: string; taskIds: string[] }
) => {
  const existedTasksList = await db.get('taskLists', id);
  const updatedList = await cb(
    existedTasksList ? existedTasksList : { id, taskIds: [] }
  );

  if (existedTasksList) {
    await db.put('taskLists', updatedList);
  } else {
    await db.add('taskLists', updatedList);
  }
};

const data = {
  get: {
    '/api/tasks': async (
      db: DB,
      {
        id,
      }: {
        id: string;
      }
    ) => {
      const tasks = await db.getAll('tasks');
      const tasksList = await db.get('taskLists', id);

      if (!tasksList) {
        return {
          tasks: {},
          order: [],
        };
      }

      const filteredTasks = tasks
        .filter(({ id }) => tasksList.taskIds.includes(id))
        .reduce((acc, task) => {
          acc[task.id] = task;
          return acc;
        }, {});

      return {
        tasks: filteredTasks,
        order: tasksList.taskIds,
      };
    },
  },
  post: {
    '/api/tasks/create': async (
      db: DB,
      data: { listId: string; task: TaskData; placement: 'top' | 'bottom' }
    ) => {
      const existedTask = await db.get('tasks', data.task.id);

      if (!existedTask) {
        await db.add('tasks', data.task);
      }

      await updateList(db, data.listId, (list) => {
        if (data.placement === 'top') {
          list.taskIds.unshift(data.task.id);
        } else {
          list.taskIds.push(data.task.id);
        }

        return list;
      });
    },
    '/api/tasks/map': async (db: DB, data: { taskIds: string[] }) => {
      const allTasks = await db.getAll('tasks');
      const tasks = allTasks.filter(({ id }) => data.taskIds.includes(id));

      return tasks.reduce((acc, task) => {
        acc[task.id] = task;
        return acc;
      }, {});
    },
  },
  delete: {
    '/api/tasks/delete': async (
      db: DB,
      { ids, listId }: { ids: string[]; listId?: string }
    ) => {
      if (!listId) {
        const tasks = await Promise.all(ids.map((id) => db.get('tasks', id)));

        const inputs: Record<string, string[]> = tasks
          .filter(({ input }) => input)
          .reduce((acc, task) => {
            if (!acc[task.input.id]) {
              acc[task.input.id] = [];
            }

            acc[task.input.id].push(task.id);

            return acc;
          }, {});

        await Promise.all([
          Promise.all(ids.map((id) => db.delete('tasks', id))),

          Promise.all(
            Object.entries(inputs).map(([inputId, taskIds]) =>
              updateList(db, inputId, (list) => {
                list.taskIds = list.taskIds.filter(
                  (id) => !taskIds.includes(id)
                );

                return list;
              })
            )
          ),

          updateList(db, Lists.WEEK, (list) => {
            list.taskIds = list.taskIds.filter((id) => !ids.includes(id));

            return list;
          }),

          updateList(db, Lists.TODAY, (list) => {
            list.taskIds = list.taskIds.filter((id) => !ids.includes(id));

            return list;
          }),
        ]);
      } else {
        await updateList(db, listId, (list) => {
          list.taskIds = list.taskIds.filter((id) => !ids.includes(id));

          return list;
        });
      }
    },
  },
  put: {
    '/api/tasks/order': async (
      db: DB,
      data: { listId: string; taskIds: string[]; destination: number }
    ) => {
      await updateList(db, data.listId, (list) => {
        list.taskIds = list.taskIds.filter((id) => !data.taskIds.includes(id));
        list.taskIds.splice(data.destination, 0, ...data.taskIds);

        return list;
      });
    },
    '/api/tasks/swap': async (
      db: DB,
      data: {
        fromListId: string;
        toListId: string;
        taskIds: string[];
        destination?: number;
      }
    ) => {

      await updateList(db, data.fromListId, (list) => {
        list.taskIds = list.taskIds.filter((id) => !data.taskIds.includes(id));

        return list;
      });

      await updateList(db, data.toListId, (list) => {
        if (data.destination !== undefined) {
          list.taskIds.splice(data.destination, 0, ...data.taskIds);
        } else {
          list.taskIds.push(...data.taskIds);
        }

        return list;
      });
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
