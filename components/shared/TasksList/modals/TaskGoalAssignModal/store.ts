import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { ListNavigation } from '../../../../../helpers/ListNavigation';

export type TaskGoalAssignModalProps = {
  callbacks: {
    onClose?: () => void;
    onSelect?: (goalId: string, spaceId: string | null) => void;
    onGoalCreateClick?: () => void;
  };
  multiple?: boolean;
  value: string;
  taskCount?: number;
};

export class TaskGoalAssignModalStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  callbacks: TaskGoalAssignModalProps['callbacks'] = {};

  emptyRef: HTMLInputElement | null = null;
  initialGoalId: string | null = null;
  selectedGoalId: string | null = null;
  taskCount: number = 1;
  multiple: boolean = false;

  keyMap = {
    RESET: ['backspace', 'delete'],
    FORCE_ENTER: ['meta+enter', 'ctrl+enter'],
  };

  hotkeyHandlers = {
    RESET: (e: KeyboardEvent) => {
      this.selectedGoalId = null;
    },
    FORCE_ENTER: (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.navigation.hotkeyHandlers.FORCE_ENTER?.(e);
    },
  };

  handleSelect = (goalIds: string[]) => {
    this.selectedGoalId = goalIds[0];
  };

  handleSubmit = () => {
    const spaceId = this.selectedGoalId
      ? this.root.resources.goals.list.find((goal) => this.selectedGoalId === goal.id)?.spaceId
      : null;
    this.callbacks.onSelect?.(this.selectedGoalId, spaceId);
  };

  update = (props: TaskGoalAssignModalProps) => {
    this.callbacks = props.callbacks;
    this.multiple = props.multiple;
    this.initialGoalId = props.value;
    this.selectedGoalId = props.value;
    this.taskCount = props.taskCount;
  };

  navigation = new ListNavigation({
    onForceEnter: this.handleSubmit,
  });
}

export const {
  StoreProvider: TaskGoalAssignModalStoreProvider,
  useStore: useTaskGoalAssignModalStore,
} = getProvider(TaskGoalAssignModalStore);
