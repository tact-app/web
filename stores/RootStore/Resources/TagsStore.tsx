import { RootStore } from '../index';
import { makeAutoObservable, runInAction } from 'mobx';
import { TaskTag } from '../../../components/shared/TasksList/types';

export class TagsStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  list: TaskTag[] = [];
  map: Record<string, TaskTag> = {};

  get count() {
    return this.list.length;
  }

  add = async (tag: TaskTag) => {
    this.list.push(tag);
    this.map[tag.id] = tag;

    await this.root.api.tags.create(tag);
  };

  init = async () => {
    const tags = await this.root.api.tags.list();

    runInAction(() => {
      this.list = tags;
      this.map = tags.reduce((acc, tag) => {
        acc[tag.id] = tag;
        return acc;
      }, {});
    });
  };
}
