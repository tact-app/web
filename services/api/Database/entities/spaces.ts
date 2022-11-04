import { DB } from '../index';
import { SpaceData } from '../../../../components/pages/Spaces/types';

const data = {
  get: {
    '/api/spaces': async (db: DB) => {
      return await db.getAll('spaces');
    },
  },
  post: {
    '/api/spaces': async (db: DB, data: SpaceData) => {
      await db.add('spaces', data);
    },
  },
  put: {
    '/api/spaces': async (
      db: DB,
      data: { id: string; fields: Partial<SpaceData> }
    ) => {
      const existedSpace = await db.get('spaces', data.id);

      if (existedSpace) {
        Object.entries(data.fields).forEach(([key, value]) => {
          existedSpace[key] = value;
        });

        await db.put('spaces', existedSpace);
      }
    },
  },
};

export default data;
