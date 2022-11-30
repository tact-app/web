import { observer } from 'mobx-react-lite';
import { CalendarView } from './view';
import { CalendarProps, CalendarStoreProvider } from './store';

export const Calendar = observer(function Calendar(props: CalendarProps) {
  return (
    <CalendarStoreProvider {...props}>
      <CalendarView {...props}/>
    </CalendarStoreProvider>
  );
});
