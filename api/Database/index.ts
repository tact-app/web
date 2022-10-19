import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { TaskData, TaskTag } from '../../components/pages/Inbox/types';
import { GoalData } from '../../components/pages/Goals/types';
import { JSONContent } from '@tiptap/core';
import { FocusConfigurationData } from '../../components/pages/Inbox/components/FocusConfiguration/store';

interface MyDB extends DBSchema {
  tasks: {
    key: string;
    value: TaskData;
    indexes: {
      'by-list-id': string;
    }
  };
  taskLists: {
    key: string;
    value: {
      id: string;
      taskIds: string[];
    }
  };
  goals: {
    key: string;
    value: GoalData;
    indexes: {
      'by-list-id': string;
    }
  };
  goalLists: {
    key: string;
    value: {
      id: string;
      goalIds: string[];
    }
  };
  tags: {
    key: string;
    value: TaskTag;
    indexes: {
      'by-title': string;
    }
  };
  descriptions: {
    key: string;
    value: {
      content: JSONContent,
      id: string,
    };
  };
  focusConfigurations: {
    key: string;
    value: {
      id: string;
    } & FocusConfigurationData
  }
}

export type DB = IDBPDatabase<MyDB>;

export async function initDb() {
  return await openDB<MyDB>('tact-db', 4, {
    upgrade(db) {
      try {
        const tasksStore = db.createObjectStore('tasks', {
          keyPath: 'id',
        });
        tasksStore.createIndex('by-list-id', 'listId');
      } catch (e) {

      }

      try {
        const goalsStore = db.createObjectStore('goals', {
          keyPath: 'id',
        });
        goalsStore.createIndex('by-list-id', 'listId');
      } catch (e) {

      }

      try {
        const tagsStore = db.createObjectStore('tags', {
          keyPath: 'id',
        });
        tagsStore.createIndex('by-title', 'title');
      } catch (e) {

      }

      try {
        db.createObjectStore('descriptions', {
          keyPath: 'id',
        });
      } catch (e) {

      }

      try {
        db.createObjectStore('taskLists', {
          keyPath: 'id',
        });
      } catch (e) {

      }

      try {
        db.createObjectStore('goalLists', {
          keyPath: 'id',
        });
      } catch (e) {

      }

      try {
        db.createObjectStore('focusConfigurations', {
          keyPath: 'id',
        });
      } catch (e) {

      }
    },
  });
}
