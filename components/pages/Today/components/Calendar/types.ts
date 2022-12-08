export type EventData = {
  id: string;
  title: string;
  description: string;
  color: string;
  start: number;
  end: number;
  dayId: string;
  isAllDay?: boolean;
};

export type DayData = {
  id: string;
  date: Date;
  from: number;
  to: number;
};
