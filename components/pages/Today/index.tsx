import { observer } from 'mobx-react-lite';
import { TodayView } from './view';
import { TodayStoreProvider } from './store';

const TodayPage = observer(function TodayPage() {
  return (
    <TodayStoreProvider>
      <TodayView />
    </TodayStoreProvider>
  );
});

export default TodayPage;
