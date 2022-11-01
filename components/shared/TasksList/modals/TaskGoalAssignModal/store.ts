import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { GoalsSelectionStore } from '../../components/GoalsSelection/store';
import { GoalData } from '../../../../pages/Goals/types';

export type TaskGoalAssignModalProps = {
  callbacks: {
    onClose?: () => void;
    onSelect?: (goalId: string) => void;
    onGoalCreateClick?: () => void;
  };
  multiple?: boolean;
  goals: GoalData[];
  value: string;
};

export class TaskGoalAssignModalStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  callbacks: TaskGoalAssignModalProps['callbacks'] = {};

  goalsSelection = new GoalsSelectionStore(this.root);
  goals: TaskGoalAssignModalProps['goals'] = [];

  selectedGoalId: string | null = null;
  multiple: boolean = false;

  keyMap = {
    UP: 'up',
    DOWN: 'down',
    NUMBER: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'],
  };

  hotkeyHandlers = {
    UP: () => {
      if (!this.goalsSelection.isFocused) {
        this.goalsSelection.focusLast();
      }
    },
    DOWN: () => {
      if (!this.goalsSelection.isFocused) {
        this.goalsSelection.focusFirst();
      }
    },
    NUMBER: (e: KeyboardEvent) => {
      const number = parseInt(e.key, 10);

      if (number && number <= this.goals.length) {
        this.selectedGoalId = this.goals[number - 1].id;
        this.goalsSelection.focus(number - 1);
      } else if (e.key === '-') {
        this.selectedGoalId = null;
        this.goalsSelection.focusFirst();
      }
    },
  };

  handleSelect = (goalIds: string[]) => {
    if (goalIds.includes(this.selectedGoalId)) {
      this.callbacks.onSelect?.(this.selectedGoalId);
    } else {
      this.selectedGoalId = goalIds[0];
    }
  };

  handleSubmit = () => {
    if (this.selectedGoalId) {
      this.callbacks.onSelect?.(this.selectedGoalId);
    }
  };

  update = (props: TaskGoalAssignModalProps) => {
    this.callbacks = props.callbacks;
    this.multiple = props.multiple;
    this.selectedGoalId = props.value;
    this.goals = props.goals;
  };
}

export const {
  StoreProvider: TaskGoalAssignModalStoreProvider,
  useStore: useTaskGoalAssignModalStore,
} = getProvider(TaskGoalAssignModalStore);
