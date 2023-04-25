import { RootStore } from '../index';
import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { SpaceData } from '../../../components/pages/Spaces/types';
import { cloneDeep, set } from "lodash";

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
        icon: '',
        color: 'gray',
        type: 'all',
        name: 'All spaces',
        children: [],
      });
    }
  }

  updateProperty = async (id: string, path: string, value: string) => {
    const spaceIndex = this.list.findIndex((space) => space.id === id);

    if (spaceIndex < 0) {
      return;
    }

    const space = set(cloneDeep(this.list[spaceIndex]), path, value);

    await this.update(space);

    this.list[spaceIndex] = space;
  };

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

  delete = async (spaceId: string) => {
    const index = this.list.findIndex(({ id }) => id === spaceId);

    if (index > -1) {
      this.list.splice(index, 1);

      if (this.list.length === 1) {
        this.list.shift();
      }

      await this.root.api.spaces.delete(spaceId);

      const { goalsToDelete, descriptionsToDelete } = this.root.resources.goals.list
        .reduce((acc, goal) => {
          if (goal.spaceId == spaceId) {
            acc.goalsToDelete.push(goal.id);

            if (goal.descriptionId) {
              acc.descriptionsToDelete.push(goal.descriptionId);
            }
          }

          return acc;
        }, { goalsToDelete: [], descriptionsToDelete: [] });
      await Promise.all([
        this.root.api.goals.delete(goalsToDelete),
        this.root.api.descriptions.delete(descriptionsToDelete)
      ]);

      return true;
    }

    return false;
  };

  init = async () => {
    const spaces = await this.root.api.spaces.list();

    if (spaces.length > 1) {
      spaces.unshift({
        id: 'all',
        icon: '',
        type: 'all',
        color: 'gray',
        name: 'All spaces',
        children: [],
      });
    }

    runInAction(() => {
      this.list = spaces;
    });
  };
}
