import { observer } from 'mobx-react-lite';
import { GoalItemProps, GoalItemStoreProvider } from './store';
import { GoalItemView } from './view';
import { useGoalListStore } from '../store';

export const GoalItem = observer(function GoalItem(props: GoalItemProps) {
  const store = useGoalListStore();

  return (
    <GoalItemStoreProvider {...props} parent={store}>
      <GoalItemView />
    </GoalItemStoreProvider>
  );
});
