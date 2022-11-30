import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';

export type CalendarProps = {};

export class CalendarStore {
  constructor() {
    makeAutoObservable(this);
  }

  update = (props: CalendarProps) => null;
}

export const {
  StoreProvider: CalendarStoreProvider,
  useStore: useCalendarStore,
} = getProvider(CalendarStore);
