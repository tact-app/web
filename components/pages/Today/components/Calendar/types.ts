export type EventData = {
  id: string;
  title: string;
  description: string;
  color: string;
  start: number;
  end: number;
  dayIndex: number;
  isAllDay?: boolean;
};
