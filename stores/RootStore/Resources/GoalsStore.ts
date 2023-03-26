import { RootStore } from '../index';
import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { GoalData } from '../../../components/pages/Goals/types';
import { DescriptionData } from '../../../types/description';
import { TaskData } from "../../../components/shared/TasksList/types";
import { cloneDeep } from 'lodash';

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

  update = async ({
    goal,
    description,
    tasks,
    order
  }: {
    goal: GoalData,
    description?: DescriptionData,
    tasks?: TaskData[],
    order?: string[],
  }) => {
    this.map[goal.id] = goal;
    await this.root.api.goals.update({ id: goal.id, fields: goal });

    if (tasks?.length) {
      const taskList = await this.root.api.tasks.list(goal.id);

      const tasksIds = tasks?.map((task) => task.id);

      const tasksToDelete = taskList.order.filter((task) => !tasksIds.includes(task));
      const { tasksToUpdate, tasksToCreate } = tasks.reduce((acc, task) => {
        if (taskList.tasks[task.id]) {
          acc.tasksToUpdate.push(task);
        } else {
          acc.tasksToCreate.push({ ...task, goalId: goal.id, spaceId: goal.spaceId });
        }

        return acc;
      }, { tasksToUpdate: [] as TaskData[], tasksToCreate: [] as TaskData[] });

      await this.root.api.tasks.delete(tasksToDelete);
      await Promise.all(tasksToUpdate.map((task) => this.root.api.tasks.update({
        id: task.id,
        fields: task,
      })));
      await this.root.api.tasks.createBulk(goal.id, tasksToCreate);

      if (order?.length) {
        await this.root.api.tasks.orderReset({
          listId: goal.id,
          order: cloneDeep(order),
        });
      }
    }

    if (description) {
      const isNewDescription = !this.descriptions[description.id];

      if (isNewDescription) {
        await this.root.api.descriptions.add({
          content: toJS(description.content),
          id: description.id,
        });
      } else {
        await this.root.api.descriptions.update({
          fields: { content: toJS(description.content) },
          id: description.id,
        });
      }

      this.descriptions[description.id] = description;
    }
  };

  add = async ({
    goal,
    description,
    tasks,
    order,
  }: {
    goal: GoalData,
    description?: DescriptionData,
    tasks?: TaskData[],
    order?: string[]
  }) => {
    this.map[goal.id] = goal;
    await this.root.api.goals.create(goal);

    if (tasks?.length) {
      await this.root.api.tasks.createBulk(
        goal.id,
        tasks.map((task) => ({
          ...task,
          goalId: goal.id,
          spaceId: goal.spaceId
        })),
        cloneDeep(order),
      );
    }

    if (description) {
      this.descriptions[description.id] = description;
      await this.root.api.descriptions.add({
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
