import { RootStore } from '../index';
import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { SpaceData } from '../../../components/pages/Spaces/types';

export class SpacesStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  list: SpaceData[] = [];

  get count() {
    return this.list.length;
  }

  getById = (id: string) => {
    return this.list.find((space) => space.id === id);
  };

  getByIndex = (index: number) => {
    return this.list[index];
  };

  getIndex = (id: string) => {
    return this.list.findIndex((space) => space.id === id);
  };

  add(space: SpaceData) {
    this.list.push(space);
    this.root.api.spaces.add(space);

    if (this.count === 2) {
      this.list.unshift({
        id: 'all',
        color: 'gray',
        type: 'all',
        name: 'All spaces',
        shortName: 'A',
        children: [],
      });
    }
  }

  update = (space: Partial<SpaceData> & { id: string }) => {
    const index = this.list.findIndex(({ id }) => id === space.id);

    if (index > -1) {
      this.list[index] = {
        ...this.list[index],
        ...space,
      };

      this.root.api.spaces.update({
        id: space.id,
        fields: toJS(space),
      });

      return true;
    }

    return false;
  };

  delete = (spaceId: string) => {
    const index = this.list.findIndex(({ id }) => id === spaceId);

    if (index > -1) {
      this.list.splice(index, 1);

      if (this.list.length === 1) {
        this.list.shift();
      }

      this.root.api.spaces.delete(spaceId);
      return true;
    }

    return false;
  };

  init = async () => {
    const spaces = await this.root.api.spaces.list();

    if (spaces.length > 1) {
      spaces.unshift({
        id: 'all',
        type: 'all',
        color: 'gray',
        name: 'All spaces',
        shortName: 'A',
        children: [],
      });
    }

    runInAction(() => {
      this.list = spaces;
    });
  };
}
