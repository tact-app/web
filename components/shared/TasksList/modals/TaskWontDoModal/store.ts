import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';

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
  checkboxRefs: HTMLInputElement[] = [];
  textareaRef: HTMLTextAreaElement | null = null;
  predefinedReasonIndex: number = null;
  predefinedReasonFocusIndex: number = 0;
  otherReason: string = '';

  onSave: TaskWontDoModalProps['onSave'];

  get isOtherReasonSelected() {
    return this.predefinedReasonIndex === WontDoReasons.length - 1;
  }

  get isFilled() {
    return this.isOtherReasonSelected
      ? !!this.otherReason
      : this.predefinedReasonIndex !== null;
  }

  setCheckboxRef = (ref, index: number) => {
    this.checkboxRefs[index] = ref;

    if (index === 0 && ref && !this.isFocused) {
      ref.focus();
      this.isFocused = true;
    }
  };

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

  handleOtherReasonChange = (e) => {
    this.otherReason = e.target.value;
  };

  handleFocus = (e) => {
    const index = parseInt(e.target.value);

    this.predefinedReasonFocusIndex = index;
  };

  handleCheckboxKeyDown = (e) => {
    const index = parseInt(e.target.value);

    if (e.key === 'ArrowDown' || e.key === 'k') {
      e.preventDefault();
      e.stopPropagation();

      if (
        index === this.checkboxRefs.length - 1 &&
        this.isOtherReasonSelected
      ) {
        this.textareaRef?.focus();
      } else if (index < this.checkboxRefs.length - 1) {
        this.checkboxRefs[this.predefinedReasonFocusIndex + 1]?.focus();
      }
    } else if (e.key === 'ArrowUp' || e.key === 'j') {
      e.preventDefault();
      e.stopPropagation();

      if (this.predefinedReasonFocusIndex > 0) {
        this.checkboxRefs[this.predefinedReasonFocusIndex - 1]?.focus();
      }
    } else if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();

      if (this.predefinedReasonIndex === index) {
        this.predefinedReasonIndex = null;
      } else {
        this.predefinedReasonIndex = index;

        if (this.isOtherReasonSelected) {
          setTimeout(() => this.textareaRef?.focus());
        }
      }
    }
  };

  handleModalKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'k') {
      e.preventDefault();

      this.checkboxRefs[0]?.focus();
    } else if (e.key === 'ArrowUp' || e.key === 'j') {
      e.preventDefault();

      if (this.isOtherReasonSelected) {
        this.textareaRef?.focus();
      } else {
        this.checkboxRefs[this.checkboxRefs.length - 1]?.focus();
      }
    } else if (e.key === 'Enter') {
      e.stopPropagation();

      if (e.ctrlKey || e.metaKey) {
        this.handleSave();
      }
    }
  };

  handleTextAreaKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();

      this.handleSave();
    } else if (e.key === 'ArrowUp') {
      e.stopPropagation();

      if (
        e.target.selectionStart === e.target.selectionEnd &&
        e.target.selectionStart === 0
      ) {
        e.preventDefault();

        this.checkboxRefs[this.checkboxRefs.length - 1]?.focus();
      }
    } else if (e.key === 'ArrowDown') {
      e.stopPropagation();
    }
  };

  update = (props: TaskWontDoModalProps) => {
    this.onSave = props.onSave;
  };
}

export const {
  StoreProvider: TaskWontDoModalStoreProvider,
  useStore: useTaskWontDoModalStore,
} = getProvider(TaskWontDoModalStore);
