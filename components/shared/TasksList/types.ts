import { SpacesInboxItemData } from '../../pages/Spaces/types';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  NONE = 'none',
}

export const TaskPriorityArray = [
  TaskPriority.LOW,
  TaskPriority.MEDIUM,
  TaskPriority.HIGH,
  TaskPriority.NONE,
];

export const TaskPriorityValues = {
  [TaskPriority.NONE]: '',
  [TaskPriority.LOW]: '!',
  [TaskPriority.MEDIUM]: '!!',
  [TaskPriority.HIGH]: '!!!',
};

export const TaskPriorityNames = {
  [TaskPriority.NONE]: 'None',
  [TaskPriority.LOW]: 'Low',
  [TaskPriority.MEDIUM]: 'Medium',
  [TaskPriority.HIGH]: 'High',
};

export const TaskPriorityKeys = Object.entries(TaskPriorityValues).reduce(
  (acc, [key, value]) => {
    acc[value] = key;
    return acc;
  },
  {}
);

export enum TaskStatus {
  DONE = 'done',
  WONT_DO = 'wont_do',
  TODO = 'todo',
}

export const TaskStatusArray = [
  TaskStatus.TODO,
  TaskStatus.WONT_DO,
  TaskStatus.DONE,
];

export type TaskData = {
  id: string;
  title: string;
  goalId?: string;
  spaceId?: string;
  input?: SpacesInboxItemData;
  tags: string[];
  descriptionId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  wontDoReason?: string;
};

export type TaskTag = { title: string; id: string };
