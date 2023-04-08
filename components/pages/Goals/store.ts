import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';
import { ModalsController } from '../../../helpers/ModalsController';
import { GoalCreationModal } from './modals/GoalCreationModal';
import { GoalDataExtended, GoalState, GoalStatus } from './types';
import { TaskData, TaskStatus } from "../../shared/TasksList/types";
import { UpdateOrCreateGoalParams } from "../../../stores/RootStore/Resources/GoalsStore";
import { GoalWontDoSubmitModal } from "./modals/GoalWontDoSubmitModal";
import { v4 as uuidv4 } from 'uuid';

export enum GoalsModalsTypes {
  CREATE_OR_UPDATE_GOAL,
  WONT_DO_SUBMIT
}

const GoalsModals = {
  [GoalsModalsTypes.CREATE_OR_UPDATE_GOAL]: GoalCreationModal,
  [GoalsModalsTypes.WONT_DO_SUBMIT]: GoalWontDoSubmitModal,
};

export class GoalsStore {
  taskList: TaskData[];

  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  keymap = {
    CREATE_GOAL: ['n'],
  };

  hotkeysHandlers = {
    CREATE_GOAL: () => {
      this.startGoalCreation();
    },
  };

  get taskListByGoal() {
    if (!this.taskList || !this.taskList.length) {
      return {};
    }

    return this.taskList.reduce((acc, task) => {
      if (!task.goalId) {
        return acc;
      }

      return ({
        ...acc,
        [task.goalId]: {
          ...acc[task.goalId],
          [task.status]: [...(acc[task.goalId]?.[task.status] ?? []), task],
          all: [...(acc[task.goalId]?.all ?? []), task],
        },
      });
    }, {} as Record<string, Record<TaskStatus | 'all', TaskData[]>>)
  }

  get extendedGoals() {
    return Object.entries(this.root.resources.goals.map).reduce((acc, [id, goal], index) => ({
      ...acc,
      [goal.spaceId]: [
        ...(acc[goal.spaceId] ?? []),
        {
          ...goal,
          customFields: {
            doneTasks: this.taskListByGoal[id]?.[TaskStatus.DONE] ?? [],
            wontDoTasks: this.taskListByGoal[id]?.[TaskStatus.WONT_DO] ?? [],
            toDoTasks: this.taskListByGoal[id]?.[TaskStatus.TODO] ?? [],
            allTasks: this.taskListByGoal[id]?.all ?? [],
            state: index === 1
              ? GoalState.IS_COMING
              : index === 2
                ? GoalState.TIME_TO_ACHIEVE
                : index === 3
                  ? GoalState.END_DATE_ALREADY_PASSED
                  : undefined
          },
        },
      ],
    }), {} as Record<string, GoalDataExtended[]>)
  }

  modals = new ModalsController(GoalsModals);

  startGoalCreation = () => {
    this.modals.open({
      type: GoalsModalsTypes.CREATE_OR_UPDATE_GOAL,
      props: {
        onSave: this.createGoal,
        onClose: this.modals.close,
      },
    });
  };

  wontDoSubmitModalOpen = (goal: GoalDataExtended) => {
    this.modals.open({
      type: GoalsModalsTypes.WONT_DO_SUBMIT,
      props: {
        onSubmit: async (wontDoReason) => {
          await this.updateGoalOnly({ ...goal, wontDoReason, status: GoalStatus.WONT_DO });
          this.modals.close();
        },
        onClose: this.modals.close,
      },
    });
  };

  cloneGoal = async ({ customFields, ...goal }: GoalDataExtended) => {
    await this.root.resources.goals.cloneGoal(goal);
  }

  editGoal = (goalId: string) => {
    this.modals.open({
      type: GoalsModalsTypes.CREATE_OR_UPDATE_GOAL,
      props: {
        onSave: async (params: UpdateOrCreateGoalParams<GoalDataExtended>) => {
          await this.updateGoal(params);
          this.modals.close();
        },
        onClose: this.modals.close,
        editMode: true,
        goal: this.root.resources.goals.map[goalId],
      },
    });
  };

  updateGoal = async ({
    goal: { customFields, ...goal },
    ...otherParams
  }: UpdateOrCreateGoalParams<GoalDataExtended>) => {
    await this.root.resources.goals.update({ goal, ...otherParams, });
    await this.loadTaskList();
  };

  updateGoalOnly = async (goal: GoalDataExtended) => {
    return this.updateGoal({ goal })
  };

  createGoal = async ({
    goal: { customFields, ...goal },
    ...otherParams
  }: UpdateOrCreateGoalParams<GoalDataExtended>) => {
    await this.root.resources.goals.add({ goal, ...otherParams });
    await this.loadTaskList();
    this.modals.close();
  };

  loadTaskList = async () => {
    this.taskList = await this.root.api.tasks.all();
  }

  init = async () => {
    await this.loadTaskList();
  };

  update = () => null;
}

export const { StoreProvider: GoalsStoreProvider, useStore: useGoalsStore } =
  getProvider(GoalsStore);
