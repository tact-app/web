import userStub from './entities/user';
import tasksStub from './entities/tasks';
import tagsStub from './entities/tags';
import ApiService from '../ApiService';
import type { DB } from './index';
import { isClient } from '../../utils';

const stubs = [
  userStub,
  tasksStub,
  tagsStub
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

  stubs = stubs.reduce((acc, stub) => {
    Object.assign(acc.get, stub.get);
    Object.assign(acc.post, stub.post);

    return acc;
  }, {
    get: {},
    post: {}
  });

  fakeRequest = <T>(method: 'get' | 'post', url: string, arg: any) => {
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
}