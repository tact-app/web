import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { TaskData } from '../../../../shared/TasksList/types';
import { EventData } from './types';

export type CalendarProps = {
  dropItem?: TaskData;
  isCollapsed?: boolean;
  callbacks: {
    onExpand?: () => void;
    onCollapse?: () => void;
  };
};

export class CalendarStore {
  constructor() {
    makeAutoObservable(this);
  }

  isCollapsed: boolean = false;

  minutesStep = 15;
  containerRef: HTMLElement = null;
  daysCount = 3;
  currentLeftDay = 0;
  dropItem: TaskData = null;

  times: string[] = Array.from({ length: 24 }).map((_, i) => `${i}:00`);
  today: Date = new Date();
  todayId: string = this.today.toDateString();
  events: EventData[] = [];

  get days() {
    return Array.from({ length: Math.min(this.daysCount, 4) }).map((_, i) => {
      const date = new Date(this.today);
      date.setDate(date.getDate() + i + this.currentLeftDay);

      return {
        date,
        id: date.toDateString(),
      };
    });
  }

  prevPage = () => {
    this.currentLeftDay -= this.daysCount;
  };

  nextPage = () => {
    this.currentLeftDay += this.daysCount;
  };

  setResolution = (count: number) => {
    if (this.currentLeftDay % count !== 0) {
      this.currentLeftDay = Math.floor(this.currentLeftDay / count) * count;
    }

    this.daysCount = count;
  };

  init = () => {};

  destroy = () => {};

  update = (props: CalendarProps) => {
    this.dropItem = props.dropItem;
    this.isCollapsed = props.isCollapsed;
  };
}

export const {
  StoreProvider: CalendarStoreProvider,
  useStore: useCalendarStore,
} = getProvider(CalendarStore);
