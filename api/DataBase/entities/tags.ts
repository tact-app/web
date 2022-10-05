import { TaskTag } from '../../../components/pages/Inbox/store/types';
import { DB } from '../index';

const data = {
  'get': {
    '/api/tags': (db: DB) => db.getAll('tags')
  },
  'post': {
    '/api/tags/create': (db: DB, data: TaskTag) => db.add('tags', data),
  }
};

export default data;