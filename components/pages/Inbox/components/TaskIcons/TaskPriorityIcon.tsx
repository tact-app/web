import React from 'react';
import { TaskPriority } from '../../store/types';

export const TaskPriorityHigh = () => (
  <svg width='16' height='17' viewBox='0 0 16 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect x='0.5' width='3' height='17' rx='1' fill='#E53E3E'/>
    <rect x='6.5' y='5' width='3' height='12' rx='1' fill='#E53E3E'/>
    <rect x='12.5' y='9' width='3' height='8' rx='1' fill='#E53E3E'/>
  </svg>
);

export const TaskPriorityMedium = () => (
  <svg width='10' height='12' viewBox='0 0 10 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect x='0.5' width='3' height='12' rx='1' fill='#ED8936'/>
    <rect x='6.5' y='4' width='3' height='8' rx='1' fill='#ED8936'/>
  </svg>
);

export const TaskPriorityLow = () => (
  <svg width='4' height='8' viewBox='0 0 4 8' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect x='0.5' width='3' height='8' rx='1' fill='#4299E1'/>
  </svg>
);

export const TaskPriorityIcon = ({ priority }: { priority: TaskPriority }) => {
  switch(priority) {
    case TaskPriority.HIGH:
      return <TaskPriorityHigh />;
    case TaskPriority.MEDIUM:
      return <TaskPriorityMedium />;
    case TaskPriority.LOW:
      return <TaskPriorityLow />;
    default:
      return null;
  }
}