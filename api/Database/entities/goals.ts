import { DB } from '../index';
import { GoalData, GoalDescriptionData } from '../../../components/pages/Goals/types';

const data = {
  'get': {
    '/api/goals': async (db: DB, { id }: { id: string }) => {
      const goals = await db.getAll('goals');
      const goalList = await db.get('goalLists', id);

      if (!goalList) {
        await db.add('goalLists', { id, goalIds: [] });

        return {
          goals: [],
          order: [],
        };
      }

      return {
        goals: goals
          .filter(({ listId }) => listId === id)
          .reduce((acc, task) => {
            acc[task.id] = task;
            return acc;
          }, {}),
        order: goalList.goalIds,
      };
    },
    '/api/goals/description': async (db: DB, data: { id: string }) => {
      return await db.get('descriptions', data.id);
    },
  },
  'post': {
    '/api/goals/description': async (db: DB, data: GoalDescriptionData) => {
      await db.add('descriptions', data);
    },
    '/api/goals/description/update': async (db: DB, data: GoalDescriptionData) => {
      const existedDescription = await db.get('descriptions', data.id);

      if (existedDescription) {
        await db.put('descriptions', existedDescription);
      }
    },
    '/api/goals/create': async (db: DB, data: GoalData) => {
      await db.add('goals', data);
      const goalLists = await db.get('goalLists', data.listId);

      if (goalLists) {
        goalLists.goalIds.push(data.id);

        await db.put('goalLists', goalLists);
      }
    },
    '/api/goals/delete': async (db: DB, { ids, listId }: { ids: string[], listId: string }) => {
      await Promise.all(ids.map((id) => db.delete('goals', id)));

      const existedList = await db.get('goalLists', listId);

      if (existedList) {
        existedList.goalIds = existedList.goalIds.filter((id) => !ids.includes(id));

        await db.put('goalLists', existedList);
      }
    },
    '/api/goals/order': async (db: DB, data: { listId: string, goalIds: string[], destination: number }) => {
      const existedList = await db.get('goalLists', data.listId);

      if (existedList) {
        existedList.goalIds = existedList.goalIds.filter((id) => !data.goalIds.includes(id));
        existedList.goalIds.splice(data.destination, 0, ...data.goalIds);

        await db.put('goalLists', existedList);
      }
    },
  },
  'put': {
    '/api/goals': async (db: DB, data: { id: string, fields: Partial<GoalData> }) => {
      const existedGoal = await db.get('goals', data.id);

      if (existedGoal) {
        Object.entries(data.fields).forEach(([key, value]) => {
          existedGoal[key] = value;
        });

        await db.put('goals', existedGoal);
      }
    },
  }
};

export default data;
