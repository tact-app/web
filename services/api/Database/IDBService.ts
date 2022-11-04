import userStub from './entities/user';
import tasksStub from './entities/tasks';
import tagsStub from './entities/tags';
import goalsStub from './entities/goals';
import descriptions from './entities/descriptions';
import spaces from './entities/spaces';
import focusConfigurations from './entities/focusConfigurations';
import { ApiService } from '../ApiService';
import type { DB } from './index';
import { isClient } from '../../../utils';

const stubs: {
  put?: Record<string, Function>;
  get?: Record<string, Function>;
  post?: Record<string, Function>;
  delete?: Record<string, Function>;
}[] = [
  userStub,
  tasksStub,
  tagsStub,
  goalsStub,
  descriptions,
  spaces,
  focusConfigurations,
];

export class IDBService extends ApiService {
  db: Promise<DB>;

  getDB = async () => {
    if (isClient) {
      const { initDb } = await import('./index');

      if (!this.db) {
        this.db = initDb();
      }
    }

    return this.db;
  };

  stubs = stubs.reduce(
    (acc, stub) => {
      Object.assign(acc.get, stub.get || {});
      Object.assign(acc.post, stub.post || {});
      Object.assign(acc.put, stub.put || {});
      Object.assign(acc.delete, stub.delete || {});

      return acc;
    },
    {
      get: {},
      post: {},
      put: {},
      delete: {},
    }
  );

  fakeRequest = <T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    arg: any
  ) => {
    return new Promise<T>(async (resolve) => {
      const stub = this.stubs[method][url];
      const db = await this.getDB();
      const result = stub ? stub(db, arg) : null;

      resolve(result);
    });
  };

  get = <R>(url: string, query?: Record<string, any>) => {
    return this.fakeRequest<R>('get', url, query);
  };

  post = <R>(url: string, params?: Record<string, any>) => {
    return this.fakeRequest<R>('post', url, params);
  };

  put = <R>(url: string, params?: Record<string, any>) => {
    return this.fakeRequest<R>('put', url, params);
  };

  delete = <R>(url: string, params?: Record<string, any>) => {
    return this.fakeRequest<R>('delete', url, params);
  };
}
