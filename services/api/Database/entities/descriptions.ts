import { DB } from '../index';
import { DescriptionData } from '../../../../types/description';

const data = {
  get: {
    '/api/description': async (db: DB, data: { id: string }) => {
      return await db.get('descriptions', data.id);
    },
  },
  post: {
    '/api/description': async (db: DB, data: DescriptionData) => {
      await db.add('descriptions', data);
    },
  },
  put: {
    '/api/description': async (
      db: DB,
      data: { id: string; fields: Partial<DescriptionData> }
    ) => {
      const existedDescription = await db.get('descriptions', data.id);

      if (existedDescription) {
        Object.entries(data.fields).forEach(([key, value]) => {
          existedDescription[key] = value;
        });

        await db.put('descriptions', existedDescription);
      }
    },
  },
};

export default data;
