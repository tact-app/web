import { DB } from '../index';
import { GoalDescriptionData } from '../../../components/pages/Goals/types';

const data = {
  'get': {
    '/api/description': async (db: DB, data: { id: string }) => {
      return await db.get('descriptions', data.id);
    },
  },
  'post': {
    '/api/description': async (db: DB, data: GoalDescriptionData) => {
      await db.add('descriptions', data);
    },
  },
  'put': {
    '/api/description': async (db: DB, data: { id: string, fields: Partial<GoalDescriptionData> }) => {
      const existedDescription = await db.get('descriptions', data.id);

      if (existedDescription) {
        Object.entries(data.fields).forEach(([key, value]) => {
          existedDescription[key] = value;
        });

        await db.put('descriptions', existedDescription);
      }
    },
  }
};

export default data;
