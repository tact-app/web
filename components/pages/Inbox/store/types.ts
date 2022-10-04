import { OutputData } from '@editorjs/editorjs';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  NONE = 'none',
}

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