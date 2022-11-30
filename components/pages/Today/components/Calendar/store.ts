import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { TaskData } from '../../../../shared/TasksList/types';

export type CalendarProps = {
  dropItem?: TaskData;
};

export class CalendarStore {
  constructor() {
    makeAutoObservable(this);
  }

  containerRef: HTMLElement = null;
  daysRefs: HTMLElement[] = [];
  daysCount = 3;
  dropItem: TaskData = null;
  containerBounds: DOMRect = null;
  daysBounds: DOMRect[] = [];

  times = Array.from({ length: 24 }).map((_, i) => `${i}:00`);
  today = new Date();

  get days() {
    return Array.from({ length: this.daysCount }).map((_, i) => {
      const date = new Date(this.today);
      date.setDate(date.getDate() + i);

      return date;
    });
  }

  setContentRef = (ref: HTMLElement) => {
    if (this.containerRef !== ref) {
      if (this.containerRef) {
        this.containerRef.removeEventListener(
          'mousemove',
          this.handleMouseMove
        );
        this.containerRef.removeEventListener('mouseup', this.handleMouseUp);
      }

      if (ref) {
        ref.addEventListener('mousemove', this.handleMouseMove);
        ref.addEventListener('mouseup', this.handleMouseUp);
      }
    }

    this.containerRef = ref;
  };

  setDayRef = (index: number, ref: HTMLElement) => {
    this.daysRefs[index] = ref;
  };

  handleMouseMove = (e: MouseEvent) => {
    console.log(e.x, e.y, this.containerBounds);
  };

  handleMouseUp = (e: MouseEvent) => {
    console.log(e);
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
