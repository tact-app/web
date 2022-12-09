import { EventTypes } from './constants';

export type EventData = {
  id: string;
  title: string;
  description: string;
  color: string;
  start: number;
  end: number;
  type: EventTypes;
  data?:
    | {
        type: EventTypes.TASK;
        id: string;
        title: string;
      }
    | {
        type: EventTypes.EVENT;
      };
  isAllDay?: boolean;
};

export type DayData = {
  id: string;
  date: Date;
  from: number;
  to: number;
};
