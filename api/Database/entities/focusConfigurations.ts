import { DB } from '../index';
import { FocusConfigurationData } from '../../../components/pages/Inbox/components/FocusConfiguration/store';

const data = {
  get: {
    '/api/focus': (db: DB, data: { id: string }) =>
      db.get('focusConfigurations', data.id),
  },
  post: {
    '/api/focus': (db: DB, data: FocusConfigurationData) =>
      db.add('focusConfigurations', data),
  },
  put: {
    '/api/focus': async (
      db: DB,
      data: { id: string; fields: Partial<FocusConfigurationData> }
    ) => {
      const existedFocusConfiguration = await db.get(
        'focusConfigurations',
        data.id
      );
      console.log(data);

      if (existedFocusConfiguration) {
        Object.entries(data.fields).forEach(([key, value]) => {
          existedFocusConfiguration[key] = value;
        });

        await db.put('focusConfigurations', existedFocusConfiguration);
      }
    },
  },
};

export default data;
