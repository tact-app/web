import React from 'react';
import { TaskPriority } from '../TasksList/types';

export const TaskPriorityHigh = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M5 10L11.8627 7.16388C12.1159 7.05924 12.401 7.06306 12.6513 7.17446L19 10'
      stroke='#E53E3E'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M5 16L11.8627 13.1639C12.1159 13.0592 12.401 13.0631 12.6513 13.1745L19 16'
      stroke='#E53E3E'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </svg>
);

export const TaskPriorityMedium = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M5 9H12.2593H19'
      stroke='#ED8936'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M5 15H12.2593H19'
      stroke='#ED8936'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </svg>
);

export const TaskPriorityLow = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M19 13L12.1373 15.8361C11.8841 15.9408 11.599 15.9369 11.3487 15.8255L5 13'
      stroke='#4299E1'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M19 7L12.1373 9.83612C11.8841 9.94076 11.599 9.93694 11.3487 9.82554L5 7'
      stroke='#4299E1'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </svg>
);

export const TaskPriorityIcon = ({ priority }: { priority: TaskPriority }) => {
  switch (priority) {
    case TaskPriority.HIGH:
      return <TaskPriorityHigh />;
    case TaskPriority.MEDIUM:
      return <TaskPriorityMedium />;
    case TaskPriority.LOW:
      return <TaskPriorityLow />;
    default:
      return null;
  }
};
