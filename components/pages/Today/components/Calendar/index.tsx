import { observer } from 'mobx-react-lite';
import { CalendarView } from './view';
import { CalendarProps, CalendarStore, CalendarStoreProvider } from './store';

export const Calendar = observer(function Calendar(
  props: CalendarProps & { instance?: CalendarStore }
) {
  return (
    <CalendarStoreProvider {...props}>
      <CalendarView />
    </CalendarStoreProvider>
  );
});
