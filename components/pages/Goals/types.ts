import { TaskData } from "../../shared/TasksList/types";

export enum GoalIconVariants {
  EMOJI = 'emoji',
  IMAGE = 'image',
}

export type GoalIconData =
  | {
      type: GoalIconVariants.EMOJI;
      value: string;
      color: string;
    }
  | {
      type: GoalIconVariants.IMAGE;
      color: string;
      value: string;
    };

export type GoalData = {
  id: string;
  title: string;
  startDate: string;
  targetDate: string;
  spaceId: string;
  descriptionId?: string;
  icon?: GoalIconData;
  status: GoalStatus;
};

export enum GoalStatus {
  WONT_DO = 'wont-do',
  TODO = 'todo',
  DONE = 'done',
}

export enum GoalState {
  IS_COMING = 'is-coming',
  TIME_TO_ACHIEVE = 'time-to-achieve',
  END_DATE_ALREADY_PASSED = 'end-date-already-passed',
}

export type GoalDataCustomFields = {
  doneTasks: TaskData[];
  wontDoTasks: TaskData[];
  toDoTasks: TaskData[];
  allTasks: TaskData[];
  state: GoalState;
}

export type GoalDataExtended = GoalData & { customFields: GoalDataCustomFields };

