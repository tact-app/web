import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import {
  NavigationDirections,
  TaskData,
} from '../../../../shared/TasksList/types';
import { EventData } from './types';
import {
  ResizableBlocksDropItemData,
  ResizableBlocksItemData,
  ResizableBlocksTypes,
} from './ResizableBlocks/types';
import {
  ResizableBlocksProps,
  ResizableBlocksStore,
} from './ResizableBlocks/store';
import { EventColors, EventTypes } from './constants';
import { RootStore } from '../../../../../stores/RootStore';

export type CalendarProps = {
  dropItem?: TaskData;
  tasks: Record<string, TaskData>;
  isCollapsed?: boolean;
  isHotkeysEnabled?: boolean;
  callbacks: {
    onTaskStatusChange?: (id: string, status: string) => void;
    onTaskScheduleChange?: (id: string, start: number, end: number) => void;
    onExpand?: () => void;
    onCollapse?: () => void;
    onFocusLeave?: (direction: NavigationDirections) => void;
    onFocusItem?: (id: string) => void;
  };
};

export class CalendarStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  callbacks: CalendarProps['callbacks'] = {};

  resizeBlocks = new ResizableBlocksStore();

  isCollapsed: boolean = false;

  hourHeight = '144px';
  dayGridStep = 15;
  dayStartTime = 0;
  dayEndTime = 24 * 60;

  daysCount = 3;
  currentLeftDay = 0;
  daysMinCountForWeek = 3;
  daysMaxCountForWeek = 7;
  dropItem: TaskData = null;

  tasks: Record<string, TaskData> = {};
  times: string[] = Array.from({ length: 24 }).map((_, i) => `${i}:00`);
  today: Date = new Date();
  todayId: string = this.today.toDateString();
  events: Record<string, EventData> = {};
  resizableEvents: Record<string, ResizableBlocksItemData> = {};

  convertTimestampToMinutes(timestamp: number) {
    return Math.round(timestamp / (1000 * 60));
  }

  convertMinutesToTimestamp(minutes: number) {
    return minutes * 1000 * 60;
  }

  get weekMinMaxDates() {
    const minDate = new Date(new Date().setDate(this.today.getDate() - this.daysMinCountForWeek));
    minDate.setHours(0, 0, 0, 0);

    const maxDate = new Date(new Date().setDate(this.today.getDate() + this.daysMaxCountForWeek));
    maxDate.setHours(23, 59, 59, 999);

    return {
      minDate: this.convertTimestampToMinutes(minDate.getTime()),
      maxDate: this.convertTimestampToMinutes(maxDate.getTime()),
    };
  }

  get resizableBlockTask(): ResizableBlocksDropItemData {
    if (!this.dropItem) {
      return null;
    }

    return {
      color: EventColors.TASK,
      type: ResizableBlocksTypes.GHOST,
      data: {
        type: EventTypes.TASK,
        id: this.dropItem.id,
        title: this.dropItem.title,
      },
    };
  }

  get prevPageDisabled() {
    return this.weekMinMaxDates.minDate >= this.days[0].from;
  }

  get nextPageDisabled() {
    return this.weekMinMaxDates.maxDate <= this.days[this.days.length - 1].to;
  }

  get days() {
    return Array.from({ length: Math.min(this.daysCount, 4) }).map((_, i) => {
      const date = new Date(this.today);
      date.setDate(date.getDate() + i + this.currentLeftDay);

      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      return {
        date,
        id: date.toDateString(),
        from: this.convertTimestampToMinutes(start.getTime()),
        to: this.convertTimestampToMinutes(end.getTime()),
      };
    });
  }

  prevPage = () => {
    this.currentLeftDay -= 1;
  };

  nextPage = () => {
    this.currentLeftDay += 1;
  };

  setResolution = (count: number) => {
    this.currentLeftDay = 0;
    this.daysCount = count;
  };

  addEvent = async (event: EventData) => {
    this.events[event.id] = event;

    const resizableBlockItemData: ResizableBlocksItemData = {
      id: event.id,
      start: this.convertTimestampToMinutes(event.start),
      end: this.convertTimestampToMinutes(event.end),
      color: event.color,
      type: ResizableBlocksTypes.SOLID,
    };

    this.resizeBlocks.addItem(resizableBlockItemData);
  };

  removeEvent = (id: string) => {
    delete this.events[id];
  };

  focus = () => {
    this.resizeBlocks.navigation.focusFirstItem();
  };

  handleEventCreate = (item: ResizableBlocksItemData) => {
    const event: EventData = {
      id: item.id,
      title: 'Event',
      data: item.data,
      description: '',
      color: EventColors.EVENT,
      type: EventTypes.EVENT,
      start: this.convertMinutesToTimestamp(item.start),
      end: this.convertMinutesToTimestamp(item.end),
    };

    this.addEvent(event);
  };

  handleTaskStatusChange = (id: string, status: string) => {
    this.callbacks.onTaskStatusChange?.(id, status);
  };

  handleOutsideClick = () => {
    this.resizeBlocks.navigation.resetFocus();
  };

  init = () => {};

  destroy = () => {};

  update = (props: CalendarProps) => {
    this.dropItem = props.dropItem;
    this.isCollapsed = props.isCollapsed;
    this.callbacks = props.callbacks || {};
    this.tasks = props.tasks;
    !this.isCollapsed && this.resizeBlocks.setDropItem(this.resizableBlockTask);
  };

  get resizableBlocksCallbacks(): ResizableBlocksProps['callbacks'] {
    return {
      onItemCreate: this.handleEventCreate,
      onItemRemove: this.removeEvent,
      onFocusLeave: this.callbacks.onFocusLeave,
      onFocusItem: this.callbacks.onFocusItem,
    };
  }
}

export const {
  StoreProvider: CalendarStoreProvider,
  useStore: useCalendarStore,
} = getProvider(CalendarStore);
