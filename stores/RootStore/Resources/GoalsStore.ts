import { RootStore } from '../index';
import { makeAutoObservable, toJS } from 'mobx';
import { GoalData, GoalStatus } from '../../../components/pages/Goals/types';
import { DescriptionData } from '../../../types/description';
import { TaskData } from "../../../components/shared/TasksList/types";
import { cloneDeep } from 'lodash';

export type UpdateOrCreateGoalParams<T = GoalData> = {
  goal: T,
  description?: DescriptionData,
  tasksData?: {
    tasks?: TaskData[],
    order?: string[],
    descriptions?: DescriptionData[],
  }
};

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
    goal: goalToUpdate,
    description,
    tasksData,
  }: UpdateOrCreateGoalParams) => {
    const goal = goalToUpdate.status === GoalStatus.WONT_DO ? goalToUpdate : { ...goalToUpdate, wontDoReason: '' };

    this.map[goal.id] = goal;
    await this.root.api.goals.update({ id: goal.id, fields: goal });

    if (tasksData?.tasks?.length) {
      const taskList = await this.root.api.tasks.list(goal.id);

      const tasksIds = tasksData.tasks.map((task) => task.id);

      const tasksToDelete = taskList.order.filter((task) => !tasksIds.includes(task));
      const { tasksToUpdate, tasksToCreate } = tasksData.tasks.reduce((acc, task) => {
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

      if (tasksData.descriptions?.length) {
        await Promise.all(
          tasksData.descriptions.map((description) =>
            this.updateDescription(description)
          )
        );
      }

      if (tasksData.order?.length) {
        await this.root.api.tasks.orderReset({
          listId: goal.id,
          order: cloneDeep(tasksData.order),
        });
      }
    }

    if (description) {
      await this.updateDescription(description);
    }
  };

  add = async ({
    goal,
    description,
    tasksData,
  }: UpdateOrCreateGoalParams) => {
    this.map[goal.id] = goal;
    await this.root.api.goals.create(goal);

    if (tasksData?.tasks?.length) {
      await this.root.api.tasks.createBulk(
        goal.id,
        tasksData.tasks.map((task) => ({
          ...task,
          goalId: goal.id,
          spaceId: goal.spaceId
        })),
        cloneDeep(tasksData.order),
      );
      await Promise.all(
        tasksData?.descriptions?.map((description) =>
          this.updateDescription(description)
        )
      );
    }

    if (description) {
      await this.updateDescription(description);
    }
  };

  updateDescription = async (description: DescriptionData) => {
    if (!(description.id in this.descriptions)) {
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

  init = async () => {
    this.map = await this.root.api.goals.list();
    this.descriptions = await this.root.api.descriptions.list();
  };
}
