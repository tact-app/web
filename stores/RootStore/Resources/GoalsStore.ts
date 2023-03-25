import { RootStore } from '../index';
import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { GoalData } from '../../../components/pages/Goals/types';
import { DescriptionData } from '../../../types/description';
import { TaskData } from "../../../components/shared/TasksList/types";

export class GoalsStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  map: Record<string, GoalData> = {};
  descriptions: Record<string, DescriptionData> = {};

  get list() {
    return Object.values(this.map);
  }

  get haveGoals() {
    return Boolean(this.list.length);
  }

  get count() {
    return this.list.length;
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
    tasks?: TaskData[],
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

  add = async (goal: GoalData, description?: DescriptionData, tasks?: TaskData[]) => {
    this.map[goal.id] = goal;
    await this.root.api.goals.create(goal);

    tasks.forEach((task) => {
      this.root.api.tasks.create(
        goal.id,
        { ...task, goalId: goal.id, spaceId: goal.spaceId },
        'bottom'
      );
    })

    if (description) {
      this.descriptions[description.id] = description;
      this.root.api.descriptions.add({
        content: toJS(description.content),
        id: description.id,
      });
    }
  };

  init = async () => {
    const { goals } = await this.root.api.goals.list('default');

    runInAction(() => {
      this.map = goals;
    });
  };
}
