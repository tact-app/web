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

export type TaskData = {
  id: string;
  title: string;
  listId: string;
  goalId?: string;
  tags: string[];
  descriptionId?: string;
  status: TaskStatus;
  priority: TaskPriority;
};

export type TaskTag = { title: string; id: string };

export enum NavigationDirections {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}
