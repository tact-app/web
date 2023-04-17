import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { ListNavigation } from '../../../../../helpers/ListNavigation';
import { TaskPriority } from '../../types';

export type TaskPriorityModalProps = {
  callbacks: {
    onClose?: () => void;
    onSelect?: (priority: TaskPriority) => void;
  };
  priority: TaskPriority;
};

export class TaskPriorityModalStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  callbacks: TaskPriorityModalProps['callbacks'] = {};

  selectedPriority: TaskPriority;
  emptyRef: HTMLInputElement | null = null;
  multiple: boolean = false;

  keyMap = {
    FORCE_ENTER: ['meta+enter'],
  };

  hotkeyHandlers = {
    FORCE_ENTER: (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.navigation.hotkeyHandlers.FORCE_ENTER?.(e);
    },
  };

  handleSelect = (priority: TaskPriority[]) => {
    this.selectedPriority = priority[0];
  };

  handleSubmit = () => {
    this.callbacks.onSelect?.(this.selectedPriority);
  };

  update = ({ priority, callbacks }: TaskPriorityModalProps) => {
    this.callbacks = callbacks;
    this.selectedPriority = priority;
  };

  navigation = new ListNavigation({
    onForceEnter: this.handleSubmit,
  });
}

export const {
  StoreProvider: TaskPriorityModalStoreProvider,
  useStore: useTaskPriorityModalStore,
} = getProvider(TaskPriorityModalStore);
