import { observer } from 'mobx-react-lite';
import { GoalListProps } from "./types";
import { GoalListStoreProvider } from './store';
import { GoalListView } from "./view";

export const GoalList = observer(function GoalList(props: GoalListProps) {
  return (
    <GoalListStoreProvider {...props}>
      <GoalListView />
    </GoalListStoreProvider>
  );
});
