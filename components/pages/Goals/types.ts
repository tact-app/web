import { JSONContent } from '@tiptap/core';
import { TaskData, TaskStatus } from "../../shared/TasksList/types";

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
  listId: string;
  startDate: string;
  targetDate: string;
  spaceId: string;
  descriptionId?: string;
  icon?: GoalIconData;
};


export enum GoalState {
  IS_COMING = 'is-coming',
  TIME_TO_ACHIEVE = 'time-to-achieve',
  END_DATE_ALREADY_PASSED = 'end-date-already-passed',
}

export type GoalDataExtended = GoalData & {
  doneTasks: TaskData[];
  wontDoTasks: TaskData[];
  toDoTasks: TaskData[];
  allTasks: TaskData[];
  state: GoalState;
};

export type GoalTemplateIcon = {
  type: GoalIconVariants.EMOJI;
  content: string;
};

export type GoalTemplateData = {
  id: string;
  title: string;
  description: JSONContent;
  icon: GoalTemplateIcon;
};
