import { OutputData } from '@editorjs/editorjs';

export enum TaskPriority {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export const TaskPriorityValues = {
  [TaskPriority.NONE]: '',
  [TaskPriority.LOW]: '!',
  [TaskPriority.MEDIUM]: '!!',
  [TaskPriority.HIGH]: '!!!',
};

export const TaskPriorityKeys = Object.entries(TaskPriorityValues)
  .reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

export enum TaskStatus {
  DONE = 'done',
  WONT_DO = 'wont_do',
  PENDING = 'pending',
}

export type TaskData = {
  id: string,
  title: string,
  tags: string[],
  description: OutputData,
  status: TaskStatus
  priority: TaskPriority,
}