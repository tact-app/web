import { DB } from '../index';
import { SpaceData } from '../../../../components/pages/Spaces/types';
import { colors } from '../../../../components/pages/Spaces/constants';
import { v4 as uuidv4 } from 'uuid';

const data = {
  get: {
    '/api/spaces': async (db: DB) => {
      const spaces = await db.getAll('spaces');

      if (!spaces.some((space) => space.type === 'personal')) {
        const personalSpace: SpaceData = {
          id: uuidv4(),
          name: 'Personal',
          icon: '',
          type: 'personal',
          color: colors[Math.floor(Math.random() * colors.length)],
          children: [],
        };

        await db.add('spaces', personalSpace);

        spaces.unshift(personalSpace);
      }

      return spaces;
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
  delete: {
    '/api/spaces': async (db: DB, data: { id: string }) => {
      await db.delete('spaces', data.id);
    },
  },
};

export default data;
