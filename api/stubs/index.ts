import userStub from './data/user'
import tasksStub from './data/tasks'
import ApiService from '../ApiService';

const stubs = [
  userStub,
  tasksStub,
]

export default class MemoryStub extends ApiService {
  stubs = stubs.reduce((acc, stub) => {
    Object.assign(acc.get, stub.get)
    Object.assign(acc.post, stub.post)

    return acc
  }, {
    get: {},
    post: {}
  })

  fakeRequest = <T>(method: 'get' | 'post', url: string, arg: any) => {
    return new Promise<T>((resolve) => {
      const stub = this.stubs[method][url]
      const result = stub ? stub(arg) : null

      setTimeout(() => resolve(result), 0)
    })
  }

  get = <R>(url: string, query?: Record<string, any>) => {
    return this.fakeRequest<R>('get', url, query)
  };

  post = <R>(url: string, params?: Record<string, any>) => {
    return this.fakeRequest<R>('get', url, params)
  };
}