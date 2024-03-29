import { makeAutoObservable } from 'mobx';
import {
  TaskQuickEditorProps,
  TaskQuickEditorStore,
} from '../TaskQuickEditor/store';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';
import { TasksListProps, TasksListStore } from '../TasksList/store';
import { NavigationDirections } from '../../../types/navigation';
import { Lists, referenceToList } from '../TasksList/constants';
import { SpacesInboxItemData } from '../../pages/Spaces/types';
import { BoxProps } from "@chakra-ui/react";

export type TasksListWithCreatorProps = TasksListProps & {
  taskCreatorCallbacks?: TaskQuickEditorProps['callbacks'];
  tasksListCallbacks?: TasksListProps['callbacks'];
  defaultSave?: boolean;
  input?: SpacesInboxItemData;
  disableSpaceChange?: boolean;
  disableGoalChange?: boolean;
  disableReferenceChange?: boolean;
  taskListWrapperProps?: BoxProps;
  displayCreatorHelpAsTooltip?: boolean;
  defaultGoalId?: string;
  defaultSpaceId?: string;
};

export class TasksListWithCreatorStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  creator = new TaskQuickEditorStore(this.root);
  list = new TasksListStore(this.root);

  keyMap = {
    FOCUS: 'n',
  };

  hotkeyHandlers = {
    FOCUS: () => {
      this.list.removeFocus();
      this.creator.setFocus(true);
    },
  };

  defaultSave: boolean = false;
  tasksListAdditions: TasksListWithCreatorProps['callbacks'] = {};
  taskCreatorAdditions: TaskQuickEditorProps['callbacks'] = {};

  get isHotkeysEnabled() {
    return this.list.isHotkeysEnabled && !this.creator.isMenuOpen && !this.root.isModalOpen;
  }

  get tasksListCallbacks(): TasksListProps['callbacks'] {
    return {
      ...this.tasksListAdditions,
      onReset: () => {
        this.creator.reset();
      },
      onFocusLeave: (direction) => {
        if (
          direction === NavigationDirections.UP ||
          direction === NavigationDirections.DOWN
        ) {
          this.creator.setFocus(true);

          return true;
        } else {
          return this.tasksListAdditions.onFocusLeave?.(direction);
        }
      },
      onEmpty: () => {
        this.creator.setFocus(true);
        this.tasksListAdditions.onEmpty?.();
      },
    };
  }

  get taskCreatorCallbacks(): TaskQuickEditorProps['callbacks'] {
    const { onFocus, ...additionalCallbacks } = this.taskCreatorAdditions;

    return {
      onSave: this.defaultSave
        ? (task, withShift, referenceId) => {
            if (!referenceId || referenceToList[referenceId] === Lists.TODAY) {
              return this.root.api.tasks.create(Lists.TODAY, task, 'bottom');
            } else if (referenceToList[referenceId] === Lists.WEEK) {
              return this.root.api.tasks.create(
                Lists.WEEK,
                task,
                referenceId === 'tomorrow' ? 'top' : 'bottom'
              );
            }

            return this.list.createTask(task, withShift);
          }
        : this.list.createTask,
      onForceSave: (taskId: string) => {
        this.list.openTask(taskId);
        this.list.draggableList.setFocusedItem(taskId);
      },
      onNavigate: this.list.handleNavigation,
      onFocus: () => {
        this.list.removeFocus();
        onFocus?.();
      },
      ...additionalCallbacks,
    };
  }

  reset = () => {
    this.creator.reset();
    this.list.reset();
  };

  update = (props: TasksListWithCreatorProps) => {
    this.tasksListAdditions = props.tasksListCallbacks || {};
    this.taskCreatorAdditions = props.taskCreatorCallbacks || {};
    this.defaultSave = props.defaultSave || false;
  };
}

export const {
  StoreProvider: TasksListWithCreatorStoreProvider,
  useStore: useTasksListWithCreatorStore,
} = getProvider(TasksListWithCreatorStore);
