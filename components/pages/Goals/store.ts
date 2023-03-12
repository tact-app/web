import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';
import { ModalsController } from '../../../helpers/ModalsController';
import { GoalCreationModal } from './modals/GoalCreationModal';
import { GoalConfigurationModal } from './modals/GoalConfigurationModal';
import { GoalData, GoalDataExtended, GoalState } from './types';
import { DescriptionData } from '../../../types/description';
import { TaskData, TaskStatus } from "../../shared/TasksList/types";
import { omit } from 'lodash';

export enum GoalsModalsTypes {
  CREATE_GOAL,
  CONFIGURE_GOAL,
}

const GoalsModals = {
  [GoalsModalsTypes.CREATE_GOAL]: GoalCreationModal,
  [GoalsModalsTypes.CONFIGURE_GOAL]: GoalConfigurationModal,
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
    if (!this.taskList?.length) {
      return {};
    }

    return this.taskList.reduce((acc, task) => {
      if (!task.goalId) {
        return acc;
      }

      return {
        ...acc,
        [task.goalId]: {
          ...acc[task.goalId],
          [task.status]: [...acc[task.goalId][task.status], task],
          all: [...acc[task.goalId].all, task],
        },
      };
    }, {} as Record<string, Record<TaskStatus | 'all', TaskData[]>>)
  }

  get extendedGoals() {
    return Object.entries(this.root.resources.goals.map).reduce((acc, [id, goal], index) => ({
      ...acc,
      [goal.spaceId]: [
        ...(acc[goal.spaceId] ?? []),
        {
          ...goal,
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
      ],
    }), {} as Record<string, GoalDataExtended[]>)
  }

  modals = new ModalsController(GoalsModals);

  openNewGoalConfigurationModal = () =>
    this.modals.open({
      type: GoalsModalsTypes.CONFIGURE_GOAL,
      props: {
        goalId: null,
        onClose: this.modals.close,
      },
    });

  startGoalCreation = () => {
    this.modals.open({
      type: GoalsModalsTypes.CREATE_GOAL,
      props: {
        onSave: this.createGoal,
        onClose: this.modals.close,
      },
    });
  };

  editGoal = (goalId: string) => {
    this.modals.open({
      type: GoalsModalsTypes.CREATE_GOAL,
      props: {
        onSave: this.updateGoal,
        onClose: this.modals.close,
        editMode: true,
        goal: this.root.resources.goals.map[goalId],
      },
    });
  };

  updateGoal = (
    goal: GoalData | GoalDataExtended,
    description?: DescriptionData,
    tasks?: TaskData[],
    isNewDescription?: boolean
  ) => {
    const preparedGoal = omit(
      goal,
      ['doneTasks', 'wontDoTasks', 'toDoTasks', 'allTasks']
    ) as GoalData;

    this.root.resources.goals.update(preparedGoal, description, tasks, isNewDescription);
    this.modals.close();
  };

  createGoal = (goal: GoalData, description?: DescriptionData, tasks?: TaskData[]) => {
    this.root.resources.goals.add(goal, description, tasks);
    this.modals.close();
  };

  init = async () => {
    this.taskList = await this.root.api.tasks.all();
  };

  update = () => null;
}

export const { StoreProvider: GoalsStoreProvider, useStore: useGoalsStore } =
  getProvider(GoalsStore);
