import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { TaskData, TaskTag } from '../../components/pages/Inbox/store/types';

interface MyDB extends DBSchema {
  tasks: {
    key: string;
    value: TaskData;
    indexes: {
      'by-index': string;
    }
  };
  tags: {
    key: string;
    value: TaskTag;
    indexes: {
      'by-title': string;
    }
  };
}

export type DB = IDBPDatabase<MyDB>;

export async function initDb() {
  return await openDB<MyDB>('tact-db', 1, {
    upgrade(db) {
      const tasksStore = db.createObjectStore('tasks', {
        keyPath: 'id',
      });
      tasksStore.createIndex('by-index', 'index');

      const tagsStore = db.createObjectStore('tags', {
        keyPath: 'id',
      });
      tagsStore.createIndex('by-title', 'title');
    },
  });
}