import { RootStore } from '../../../../stores/RootStore';
import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../helpers/StoreProvider';
import { TaskData } from './types';

class TasksStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this)
  }

  items: TaskData[] = []

  openTask = (id: string) => {

  }

  init = async () => {
    this.items = await this.root.api.tasks.getList()
  }
}

export const {
  useStore: useTasksStore,
  StoreProvider: TasksStoreProvider,
} = getProvider(TasksStore);