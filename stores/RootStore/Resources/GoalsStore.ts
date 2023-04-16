import { RootStore } from '../index';
import { makeAutoObservable, toJS } from 'mobx';
import { GoalData, GoalStatus } from '../../../components/pages/Goals/types';
import { DescriptionData } from '../../../types/description';
import { TaskData } from "../../../components/shared/TasksList/types";
import { cloneDeep, omit } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Lists } from "../../../components/shared/TasksList/constants";

export type CreateGoalParams<T = GoalData> = {
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

  delete = async (ids: string[]) => {
    await this.root.api.goals.delete(ids);

    this.map = omit(this.map, ids);
  };

  update = async (goalToUpdate: GoalData) => {
    const goal = {
      ...goalToUpdate,
      wontDoReason: goalToUpdate.status === GoalStatus.WONT_DO ? goalToUpdate.wontDoReason : '',
    };

    this.map[goal.id] = goal;
    await this.root.api.goals.update({ id: goal.id, fields: goal });
  };

  add = async ({
    goal,
    description,
    tasksData,
  }: CreateGoalParams) => {
    this.map[goal.id] = goal;
    await this.root.api.goals.create(goal);

    if (tasksData?.tasks?.length) {
      await this.root.api.tasks.createBulk(
        Lists.TODAY,
        tasksData.tasks.map((task) => ({
          ...task,
          goalId: goal.id,
          spaceId: goal.spaceId
        })),
        cloneDeep(tasksData.order),
        goal.id
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

  cloneGoal = async (goal: GoalData) => {
    const description = await this.root.api.descriptions.get(goal.descriptionId);

    const goalToClone = {
      ...goal,
      title: `Copied: ${goal.title}`,
      id: uuidv4(),
      descriptionId: uuidv4()
    };
    const descriptionToClone = { ...description, id: goalToClone.descriptionId };

    await this.root.api.descriptions.add(descriptionToClone);
    this.descriptions[descriptionToClone.id] = descriptionToClone;

    await this.add({ goal: goalToClone });

    return goalToClone;
  }

  init = async () => {
    this.map = await this.root.api.goals.list();
    this.descriptions = await this.root.api.descriptions.list();
  };
}
