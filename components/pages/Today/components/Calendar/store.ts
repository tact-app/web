import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { TaskData } from '../../../../shared/TasksList/types';
import { EventData } from './types';
import { v4 as uuidv4 } from 'uuid';

export type CalendarProps = {
  dropItem?: TaskData;
};

export class CalendarStore {
  constructor() {
    makeAutoObservable(this);
  }

  minutesStep = 15;
  containerRef: HTMLElement = null;
  daysRefs: HTMLElement[] = [];
  daysCount = 3;
  currentLeftDay = 0;
  columnsContainerWidth = 100;
  dropItem: TaskData = null;
  containerBounds: DOMRect = null;
  daysBounds: DOMRect[] = [];

  startDraggingY: number = 0;
  resizeDelta: number = 0;
  resizedEventId: string = null;
  resizedDayIndex: number = null;
  isResizeActive: boolean = false;
  resizeDirection: string = null;

  droppableDayIndex: number | null = null;
  droppableTime: number | null = null;

  times = Array.from({ length: 24 }).map((_, i) => `${i}:00`);
  today = new Date();
  events: Record<string, EventData[]> = {};

  get grid(): [number, number] {
    const value =
      this.containerRef.scrollHeight /
      this.times.length /
      (60 / this.minutesStep);

    return [1, value];
  }

  get ghostEvent(): EventData {
    if (
      !this.dropItem ||
      this.droppableTime === null ||
      this.droppableDayIndex === null
    ) {
      return null;
    }

    const time = this.droppableTime;

    const start = new Date(this.today);
    start.setHours(0, 0, 0, 0);
    start.setMilliseconds(time);
    start.setDate(this.today.getDate() + this.droppableDayIndex);

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + this.minutesStep);

    return {
      id: 'ghost',
      title: this.dropItem.title,
      description: this.dropItem.descriptionId,
      color: 'blue.200',
      dayIndex: this.droppableDayIndex,
      start: start.valueOf(),
      end: end.valueOf(),
    };
  }

  get days() {
    return Array.from({ length: Math.min(this.daysCount, 4) }).map((_, i) => {
      const date = new Date(this.today);
      date.setDate(date.getDate() + i + this.currentLeftDay);

      return {
        index: i + this.currentLeftDay,
        date,
      };
    });
  }

  castOffsetToTime = (y: number) => {
    const absY = Math.abs(y);
    const isNegative = y < 0;
    const totalHeight = this.containerRef.scrollHeight;
    const hourHeight = totalHeight / 24;

    const hour = Math.floor(absY / hourHeight);
    const minute = Math.floor((absY % hourHeight) / (hourHeight / 60));

    const roundedMinutes =
      Math.round(minute / this.minutesStep) * this.minutesStep;

    const result = hour * 60 * 60 * 1000 + roundedMinutes * 60 * 1000;

    return isNegative ? -result : result;
  };

  castTimeToOffset = (time: number) => {
    const date = new Date(time);
    const totalHeight = this.containerRef.scrollHeight;
    const hourHeight = totalHeight / 24;

    return date.getHours() * hourHeight + (date.getMinutes() * hourHeight) / 60;
  };

  prevPage = () => {
    this.currentLeftDay -= this.daysCount;
  };

  nextPage = () => {
    this.currentLeftDay += this.daysCount;
  };

  setContainerRef = (ref: HTMLElement) => {
    this.containerRef = ref;
  };

  setResolution = (count: number) => {
    if (this.currentLeftDay % count !== 0) {
      this.currentLeftDay = Math.floor(this.currentLeftDay / count) * count;
    }

    this.daysCount = count;
  };

  setColumnsContainerWidth = (width: number) => {
    this.columnsContainerWidth = width;
  };

  setDayRef = (viewIndex: number, ref: HTMLElement) => {
    this.daysRefs[viewIndex] = ref;
  };

  addEvent = (event: EventData) => {
    if (!this.events[event.dayIndex]) {
      this.events[event.dayIndex] = [];
    }

    this.events[event.dayIndex].push(event);
  };

  endDragging = (event: EventData, y: number) => {
    const delta = this.castOffsetToTime(this.startDraggingY - y);

    event.start -= delta;
    event.end -= delta;
  };

  startDragging = (event: EventData, y: number) => {
    this.startDraggingY = y;
  };

  endResize = (event: EventData, direction: string, delta: number) => {
    if (direction === 'top') {
      event.start -= this.castOffsetToTime(delta);
    } else if (direction === 'bottom') {
      event.end += this.castOffsetToTime(delta);
    }

    this.isResizeActive = false;
    this.resizedEventId = null;
    this.resizedDayIndex = null;
  };

  resize = (delta) => {
    this.resizeDelta = delta;
  };

  startResize = (event: EventData, direction: string) => {
    this.resizeDirection = direction;
    this.isResizeActive = true;
    this.resizedEventId = event.id;
    this.resizeDelta = 0;
  };

  checkMouseInBounds = (bounds: DOMRect, x: number, y: number) => {
    const { left, top, width, height } = bounds;

    return x >= left && x <= left + width && y >= top && y <= top + height;
  };

  handleMouseMove = (e: MouseEvent) => {
    if (
      this.containerBounds &&
      this.checkMouseInBounds(this.containerBounds, e.clientX, e.clientY)
    ) {
      const dayViewIndex = this.daysBounds.findIndex((bound) =>
        this.checkMouseInBounds(bound, e.clientX, e.clientY)
      );
      const dayIndex =
        dayViewIndex !== -1 ? this.currentLeftDay + dayViewIndex : null;

      if (dayIndex !== null) {
        const realY =
          e.clientY - this.containerBounds.top + this.containerRef.scrollTop;

        this.droppableTime = this.castOffsetToTime(realY);
        this.droppableDayIndex = dayIndex;

        return;
      }
    }

    this.droppableTime = null;
    this.droppableDayIndex = null;
  };

  init = () => {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  destroy = () => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseUp = (e: MouseEvent) => {
    this.addEvent({ ...this.ghostEvent, id: uuidv4() });
  };

  update = (props: CalendarProps) => {
    this.dropItem = props.dropItem;

    if (this.dropItem) {
      this.containerBounds = this.containerRef.getBoundingClientRect();
      this.daysBounds = this.daysRefs.map((ref) => ref.getBoundingClientRect());
    }
  };
}

export const {
  StoreProvider: CalendarStoreProvider,
  useStore: useCalendarStore,
} = getProvider(CalendarStore);
