import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { TaskData, TaskTag } from '../../../components/shared/TasksList/types';
import { GoalData } from '../../../components/pages/Goals/types';
import { JSONContent } from '@tiptap/core';
import { FocusConfigurationData } from '../../../components/pages/Today/components/FocusConfiguration/store';
import { SpaceData } from '../../../components/pages/Spaces/types';
import { UserStore } from '../../../stores/UserStore';

interface MyDB extends DBSchema {
  tasks: {
    key: string;
    value: TaskData;
  };
  taskLists: {
    key: string;
    value: {
      id: string;
      taskIds: string[];
    };
  };
  goals: {
    key: string;
    value: GoalData;
    indexes: {
      'by-list-id': string;
    };
  };
  goalLists: {
    key: string;
    value: {
      id: string;
      goalIds: string[];
    };
  };
  tags: {
    key: string;
    value: TaskTag;
    indexes: {
      'by-title': string;
    };
  };
  descriptions: {
    key: string;
    value: {
      content: JSONContent;
      id: string;
    };
  };
  focusConfigurations: {
    key: string;
    value: {
      id: string;
    } & FocusConfigurationData;
  };
  spaces: {
    key: string;
    value: SpaceData;
  };
}

export type DB = IDBPDatabase<MyDB>;

export async function initDb() {
  return await openDB<MyDB>(`tact-db-${UserStore.user.sub}`, 5, {
    upgrade(db) {
      try {
        db.createObjectStore('tasks', {
          keyPath: 'id',
        });
      } catch (e) {}

      try {
        db.createObjectStore('goals', {
          keyPath: 'id',
        });
      } catch (e) {}

      try {
        const tagsStore = db.createObjectStore('tags', {
          keyPath: 'id',
        });
        tagsStore.createIndex('by-title', 'title');
      } catch (e) {}

      try {
        db.createObjectStore('descriptions', {
          keyPath: 'id',
        });
      } catch (e) {}

      try {
        db.createObjectStore('taskLists', {
          keyPath: 'id',
        });
      } catch (e) {}

      try {
        db.createObjectStore('goalLists', {
          keyPath: 'id',
        });
      } catch (e) {}

      try {
        db.createObjectStore('focusConfigurations', {
          keyPath: 'id',
        });
      } catch (e) {}

      try {
        db.createObjectStore('spaces', {
          keyPath: 'id',
        });
      } catch (e) {}
    },
  });
}
