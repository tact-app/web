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
        goalId,
      }: {
        id: string;
        goalId: string;
      }
    ) => {
      const tasks = await db.getAll('tasks');
      const tasksList = await db.get('taskLists', goalId || id);

      if (!tasksList) {
        return {
          tasks: {},
          order: [],
        };
      }

      const filteredTasks = tasks
        .filter((task) => tasksList.taskIds.includes(task.id) && (!goalId || task.goalId === goalId))
        .reduce((acc, task) => ({
          ...acc,
          [task.id]: task,
        }), {});

      return {
        tasks: filteredTasks,
        order: tasksList.taskIds,
      };
    },
    '/api/tasks/all': (db: DB) => {
      return db.getAll('tasks');
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

      if (data.task.goalId) {
        await updateList(db, data.task.goalId, (list) => {
          if (data.placement === 'top') {
            list.taskIds.unshift(data.task.id);
          } else {
            list.taskIds.push(data.task.id);
          }

          return list;
        });
      }
    },
    '/api/tasks/create/bulk': (
      db: DB,
      data: { listId: string; goalId?: string; tasks: TaskData[]; order: string[] }
    ) => {
      return Promise.all([
        ...data.tasks.map((task) => db.add('tasks', task)),
        updateList(db, data.listId, (list) => {
          list.taskIds.push(...data.tasks.map((task) => task.id));

          return list;
        }),
        data.goalId ? db.add('taskLists', { id: data.goalId, taskIds: data.order }) : null,
      ])
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
      { ids, listId }: { ids: string[]; listId?: string; }
    ) => {
      if (!listId) {
        const tasks = await Promise.all(ids.map((id) => db.get('tasks', id)));

        const inputs: Record<string, string[]> = tasks
          .filter((task) => task?.input)
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
          
          ...tasks.map((task) => updateList(db, task.goalId, (list) => {
            list.taskIds = list.taskIds.filter((id) => !ids.includes(id));

            return list;
          }))
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
    '/api/tasks/order/reset': async (
      db: DB,
      data: { listId: string; order: string[] }
    ) => {
      await db.delete('taskLists', data.listId);
      return db.add('taskLists', { id: data.listId, taskIds: data.order });
    },
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
        const lastGoalId = existedTask.goalId;

        Object.entries(data.fields).forEach(([key, value]) => {
          existedTask[key] = value;
        });

        await db.put('tasks', existedTask);

        if (lastGoalId !== data.fields.goalId) {
          if (lastGoalId) {
            await updateList(db, lastGoalId, (list) => {
              list.taskIds = list.taskIds.filter((taskId) => taskId !== existedTask.id);

              return list;
            });
          }

          if (data.fields.goalId) {
            await updateList(db, data.fields.goalId, (list) => {
              list.taskIds = [...list.taskIds, existedTask.id];

              return list;
            });
          }
        }
      }
    },
    '/api/tasks/assign-goal': async (
      db: DB,
      data: { taskIds: string[]; goalId: string | null; spaceId: string | null }
    ) => {
      await Promise.all(
        data.taskIds.map(async (id) => {
          const existedTask = await db.get('tasks', id);

          if (existedTask) {
            await db.put('tasks', {
              ...existedTask,
              goalId: data.goalId,
              spaceId: data.spaceId || existedTask.spaceId
            });

            if (existedTask.goalId) {
              await updateList(db, existedTask.goalId, (list) => {
                list.taskIds = list.taskIds.filter((taskId) => taskId !== id);

                return list;
              });
            }

            if (data.goalId) {
              await updateList(db, data.goalId, (list) => {
                list.taskIds = [...list.taskIds, id];

                return list;
              });
            }
          }
        }),
      );
    },
  },
};

export default data;
