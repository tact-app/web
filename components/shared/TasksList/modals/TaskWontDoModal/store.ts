import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { ListNavigation } from '../../../../../helpers/ListNavigation';

export type TaskWontDoModalProps = {
  onClose: () => void;
  onSave: (reason: string) => void;
};

export const WontDoReasons = [
  'Too hard',
  'Not important',
  'Expired',
  'Not now',
  'Other',
];

export class TaskWontDoModalStore {
  constructor() {
    makeAutoObservable(this);
  }

  isFocused = false;
  textareaRef: HTMLTextAreaElement | null = null;
  predefinedReasonIndex: number = null;
  otherReason: string = '';

  keyMap = {
    RESET: ['backspace', 'delete'],
    FORCE_ENTER: ['meta+enter'],
  };

  hotkeyHandlers = {
    RESET: (e: KeyboardEvent) => {
      this.predefinedReasonIndex = null;
    },
    FORCE_ENTER: (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.navigation.hotkeyHandlers.FORCE_ENTER?.(e);
    },
  };


  onSave: TaskWontDoModalProps['onSave'];

  get isOtherReasonSelected() {
    return this.predefinedReasonIndex === WontDoReasons.length - 1;
  }

  get isFilled() {
    return this.isOtherReasonSelected
      ? !!this.otherReason
      : this.predefinedReasonIndex !== null;
  }

  setTextareaRef = (ref) => {
    this.textareaRef = ref;
  };

  handleSave = () => {
    if (this.isFilled) {
      if (this.isOtherReasonSelected) {
        this.onSave(this.otherReason);
      } else {
        this.onSave(WontDoReasons[this.predefinedReasonIndex]);
      }
    }
  };

  handleCheckboxChange = (e) => {
    const value = parseInt(e.target.value);

    if (this.predefinedReasonIndex === value) {
      this.predefinedReasonIndex = null;
    } else {
      this.predefinedReasonIndex = value;
    }

    if (this.isOtherReasonSelected) {
      setTimeout(() => this.textareaRef?.focus());
    }
  };

  handleTextareaKeyDown = (e) => {
    if (e.key === 'Escape') {
      return;
    }

    if (e.key === 'ArrowUp') {
      if (
        e.target.selectionStart !== e.target.selectionEnd ||
        e.target.selectionStart !== 0
      ) {
        e.stopPropagation();
      }
    } else if (e.key === 'Enter') {
      if (!(e.metaKey)) {
        e.stopPropagation();
      }
    } else {
      e.stopPropagation();
    }
  };

  handleOtherReasonChange = (e) => {
    this.otherReason = e.target.value;
  };

  update = (props: TaskWontDoModalProps) => {
    this.onSave = props.onSave;
  };

  navigationCallbacks = {
    onForceEnter: () => {
      this.handleSave();
    },
  };

  navigation = new ListNavigation(this.navigationCallbacks);
}

export const {
  StoreProvider: TaskWontDoModalStoreProvider,
  useStore: useTaskWontDoModalStore,
} = getProvider(TaskWontDoModalStore);
