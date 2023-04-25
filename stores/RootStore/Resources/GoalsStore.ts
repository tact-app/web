import { RootStore } from '../index';
import { makeAutoObservable, toJS } from 'mobx';
import { GoalData, GoalDataExtended, GoalState, GoalStatus } from '../../../components/pages/Goals/types';
import { DescriptionData } from '../../../types/description';
import { TaskData } from "../../../components/shared/TasksList/types";
import { cloneDeep, omit, set } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Lists } from "../../../components/shared/TasksList/constants";
import moment, { Moment } from "moment/moment";

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
  currentDay: Moment = moment();

  get list() {
    return Object.values(this.map);
  }

  get haveGoals() {
    return Boolean(this.list.length);
  }

  get listBySpaces() {
    const goalsBySpaces = this.list.reduce((acc, goal, index) => ({
      ...acc,
      [goal.spaceId]: [
        ...(acc[goal.spaceId] ?? []),
        {
          ...goal,
          customFields: {
            state: this.getStateByDate(goal.startDate, goal.targetDate),
          },
        },
      ],
    }), {} as Record<string, GoalDataExtended[]>);

    let order = 0;

    return Object.entries(goalsBySpaces).map(([spaceId, goals]) => {
      return ({
        space: this.root.resources.spaces.getById(spaceId),
        goals: goals.map((goal) => {
          const goalWithOrder = { ...goal, customFields: { ...goal.customFields, order } };
          order++;

          return goalWithOrder;
        }) as GoalDataExtended[],
      })
    });
  }

  get count() {
    return this.list.length;
  }

  getById(id: string) {
    return this.map[id];
  }

  getStateByDate = (startDate: string, targetDate: string) => {
    const start = moment(startDate);
    const target = moment(targetDate);

    const beforeStartDiff = start.diff(this.currentDay, 'days');
    const beforeTargetDiff = target.diff(this.currentDay, 'days');

    if (startDate && beforeStartDiff <= 14 && beforeStartDiff > 0) {
      return GoalState.IS_COMING;
    } else if (targetDate && beforeStartDiff <= 0 && beforeTargetDiff <= 14 && beforeTargetDiff >= 0) {
      return GoalState.TIME_TO_ACHIEVE;
    } else if (targetDate && beforeTargetDiff < 0) {
      return GoalState.END_DATE_ALREADY_PASSED;
    }
  };

  getByIndex = (index: number) => {
    return this.list[index];
  };

  delete = async (ids: string[]) => {
    await this.root.api.goals.delete(ids);

    this.map = omit(this.map, ids);
  };

  updateProperty = async (id: string, path: string, value: string) => {
    const goal = set(cloneDeep(this.map[id]), path, value);

    await this.update(goal)

    this.map[id] = goal;
  };

  update = async (goalToUpdate: GoalData) => {
    const prevGoalData = cloneDeep(this.map[goalToUpdate.id]);
    const goal = {
      ...goalToUpdate,
      wontDoReason: goalToUpdate.status === GoalStatus.WONT_DO ? goalToUpdate.wontDoReason : '',
      updatedDate: new Date().toISOString(),
    };

    this.map[goal.id] = goal;
    await this.root.api.goals.update({ id: goal.id, fields: goal });

    if (prevGoalData.spaceId !== goal.spaceId) {
      const taskList = await this.root.api.tasks.all();

      await this.root.api.tasks.assignGoal({
        taskIds: taskList.filter((task) => task.goalId === goal.id).map((task) => task.id),
        goalId: goal.id,
        spaceId: goal.spaceId,
      })
    }
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
