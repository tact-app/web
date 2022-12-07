import { observer } from 'mobx-react-lite';
import {
  Modes,
  TaskQuickEditorProps,
  TaskQuickEditorStore,
  TaskQuickEditorStoreProvider,
} from '../TaskQuickEditor/store';
import { TaskCreatorProps, TaskCreatorView } from './view';

const modesOrder = [
  Modes.TAG,
  Modes.SPACE,
  Modes.GOAL,
  Modes.PRIORITY,
  Modes.REFERENCE,
];

export const TaskCreator = observer(function TaskCreator(
  props: TaskQuickEditorProps &
    TaskCreatorProps & { instance?: TaskQuickEditorStore }
) {
  return (
    <TaskQuickEditorStoreProvider
      {...props}
      order={modesOrder}
      enableReferences
    >
      <TaskCreatorView {...props} />
    </TaskQuickEditorStoreProvider>
  );
});
