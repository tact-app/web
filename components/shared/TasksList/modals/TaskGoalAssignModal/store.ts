import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { GoalsSelectionStore } from '../../../GoalsSelection/store';
import { ListNavigation } from '../../../../../helpers/ListNavigation';

export type TaskGoalAssignModalProps = {
  callbacks: {
    onClose?: () => void;
    onSelect?: (goalId: string) => void;
    onGoalCreateClick?: () => void;
  };
  multiple?: boolean;
  value: string;
};

export class TaskGoalAssignModalStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  callbacks: TaskGoalAssignModalProps['callbacks'] = {};

  goalsSelection = new GoalsSelectionStore(this.root);

  emptyRef: HTMLInputElement | null = null;
  selectedGoalId: string | null = null;
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
    if (goalIds.includes(this.selectedGoalId)) {
      this.selectedGoalId = null;
    } else {
      this.selectedGoalId = goalIds[0];
    }
  };

  handleSubmit = () => {
    this.callbacks.onSelect?.(this.selectedGoalId);
  };

  update = (props: TaskGoalAssignModalProps) => {
    this.callbacks = props.callbacks;
    this.multiple = props.multiple;
    this.selectedGoalId = props.value;
  };

  navigation = new ListNavigation({
    onForceEnter: this.handleSubmit,
  });
}

export const {
  StoreProvider: TaskGoalAssignModalStoreProvider,
  useStore: useTaskGoalAssignModalStore,
} = getProvider(TaskGoalAssignModalStore);
