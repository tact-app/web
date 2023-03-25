import { DB } from '../index';
import { GoalData } from '../../../../components/pages/Goals/types';
import { DescriptionData } from '../../../../types/description';
import { cloneDeep } from 'lodash';

const data = {
  get: {
    '/api/goals': async (db: DB, { id }: { id: string }) => {
      const goals = await db.getAll('goals');

      return {
        goals: goals
          .reduce((acc, goal) => {
            acc[goal.id] = goal;
            return acc;
          }, {}),
      };
    },
    '/api/goals/description': async (db: DB, data: { id: string }) => {
      return await db.get('descriptions', data.id);
    },
  },
  post: {
    '/api/goals/description': async (db: DB, data: DescriptionData) => {
      await db.add('descriptions', data);
    },
    '/api/goals/description/update': async (db: DB, data: DescriptionData) => {
      const existedDescription = await db.get('descriptions', data.id);

      if (existedDescription) {
        await db.put('descriptions', existedDescription);
      }
    },
    '/api/goals/create': async (db: DB, data: GoalData) => {
      return db.add('goals', cloneDeep(data));
    },
    '/api/goals/delete': async (
      db: DB,
      { ids }: { ids: string[] }
    ) => {
      await Promise.all(ids.map((id) => db.delete('goals', id)));
    },
  },
  put: {
    '/api/goals': async (
      db: DB,
      data: { id: string; fields: Partial<GoalData> }
    ) => {
      const existedGoal = await db.get('goals', data.id);

      if (existedGoal) {
        Object.entries(cloneDeep(data.fields)).forEach(([key, value]) => {
          existedGoal[key] = value;
        });

        await db.put('goals', existedGoal);
      }
    },
  },
};

export default data;
