import { RootStore } from '../index';
import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { GoalData } from '../../../components/pages/Goals/types';
import { DescriptionData } from '../../../types/description';

export class GoalsStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  map: Record<string, GoalData> = {};
  order: string[] = [];
  descriptions: Record<string, DescriptionData> = {};

  get list() {
    return this.order.map((id) => this.map[id]);
  }

  get count() {
    return this.order.length;
  }

  getById(id: string) {
    return this.map[id];
  }

  getByIndex = (index: number) => {
    return this.list[index];
  };

  update = (
    goal: GoalData,
    description?: DescriptionData,
    isNewDescription?: boolean
  ) => {
    this.map[goal.id] = goal;
    this.root.api.goals.update({ id: goal.id, fields: goal });

    if (description) {
      this.descriptions[description.id] = description;

      if (isNewDescription) {
        this.root.api.descriptions.add({
          content: toJS(description.content),
          id: description.id,
        });
      } else {
        this.root.api.descriptions.update({
          fields: { content: toJS(description.content) },
          id: description.id,
        });
      }
    }
  };

  add = (goal: GoalData, description?: DescriptionData) => {
    this.map[goal.id] = goal;
    this.order.push(goal.id);
    this.root.api.goals.create(goal);

    if (description) {
      this.descriptions[description.id] = description;
      this.root.api.descriptions.add({
        content: toJS(description.content),
        id: description.id,
      });
    }
  };

  init = async () => {
    const { goals, order } = await this.root.api.goals.list('default');

    runInAction(() => {
      this.map = goals;
      this.order = order;
    });
  };
}
