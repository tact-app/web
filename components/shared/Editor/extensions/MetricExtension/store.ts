import { makeAutoObservable, runInAction } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { NodeViewProps } from '@tiptap/core';
import { MetricExtensionTypes } from './command';

export type MetricExtensionProps = {
  updateAttributes: (attributes: Record<string, any>) => void;
} & NodeViewProps;

export class MetricExtensionStore {
  constructor() {
    makeAutoObservable(this);
  }

  props: MetricExtensionProps;

  targetValue: number = 0;
  value: number = 0;
  type: MetricExtensionTypes;

  inputRef = null;
  secondInputRef = null;

  focusTimeout: number;
  isFocused = false;

  get isCompleted() {
    switch (this.props.node.attrs.type) {
      case MetricExtensionTypes.RING:
        return this.value === 100;
      case MetricExtensionTypes.NUMBER:
        return this.value >= this.targetValue;
      case MetricExtensionTypes.TODO:
        return this.value === 1;
    }
  }

  setInputRef = (ref: HTMLInputElement) => {
    this.inputRef = ref;
  };

  setSecondInputRef = (ref: HTMLInputElement) => {
    this.secondInputRef = ref;
  };

  handleFocus = () => {
    clearTimeout(this.focusTimeout);

    this.isFocused = true;

    if (this.type === MetricExtensionTypes.RING) {
      const count = this.value.toString().length;

      this.inputRef.setSelectionRange(count, count);
    }
  };

  handleBlur = () => {
    clearTimeout(this.focusTimeout);

    this.focusTimeout = window.setTimeout(() => {
      runInAction(() => {
        this.isFocused = false;
      });
    }, 200);
  };

  handleChangeTargetValue = (e) => {
    const newValue = parseInt(e.target.value) || 0;

    this.props.updateAttributes({
      targetValue: newValue,
    });
    this.targetValue = newValue;
  };

  handleChangeStartValue = (e) => {
    const newValue = parseInt(e.target.value) || 0;

    this.props.updateAttributes({
      value: newValue,
    });
    this.value = newValue;
  };

  handleKewDown = (e) => {
    e.stopPropagation();

    if (e.key === 'Escape') {
      this.props.editor.chain().focus().run();
    }

    if (this.type === MetricExtensionTypes.RING) {
      if (e.key === 'ArrowUp' && this.value < 100) {
        this.props.updateAttributes({
          value: this.value + 1,
        });
      }

      if (e.key === 'ArrowDown' && this.value > 0) {
        this.props.updateAttributes({
          value: this.value - 1,
        });
      }
    }

    if (
      this.type === MetricExtensionTypes.TODO ||
      this.type === MetricExtensionTypes.RING
    ) {
      if (e.key === 'Tab') {
        e.preventDefault();

        this.props.editor.chain().focus().run();
      }

      if (e.key === 'Enter') {
        this.props.editor.chain().focus().run();
      }
    }

    if (this.type === MetricExtensionTypes.NUMBER) {
      if (e.key === 'Tab') {
        e.preventDefault();

        if (e.shiftKey) {
          this.props.editor.chain().focus().run();
        } else {
          this.secondInputRef.focus();
        }
      }

      if (e.key === 'Enter') {
        this.secondInputRef.focus();
      }
    }
  };

  handleSecondKewDown = (e) => {
    e.stopPropagation();

    if (e.key === 'Escape') {
      this.props.editor.chain().focus().run();
    }

    if (this.type === MetricExtensionTypes.NUMBER) {
      if (e.key === 'Tab') {
        e.preventDefault();

        if (e.shiftKey) {
          this.inputRef.focus();
        } else {
          this.props.editor.chain().focus().run();
        }
      }

      if (e.key === 'Enter') {
        this.props.editor.chain().focus().run();
      }
    }
  };

  handleChangeValue = (e) => {
    const newValue = Math.min(
      Math.max(0, Math.floor(parseInt(e.target.value) || 0)),
      100
    );

    this.props.updateAttributes({
      value: newValue,
    });
    this.value = newValue;
  };

  handleChangeToDo = (e) => {
    const newValue = e.target.checked ? 1 : 0;

    this.props.updateAttributes({
      value: newValue,
    });
    this.value = newValue;
  };

  update = (props: MetricExtensionProps) => {
    this.props = props;
    this.value = props.node.attrs.value;
    this.type = props.node.attrs.type;
    this.targetValue = props.node.attrs.targetValue;

    if (props.node.attrs.focus) {
      this.isFocused = true;
      this.inputRef?.focus();
    }
  };
}

export const {
  StoreProvider: MetricExtensionStoreProvider,
  useStore: useMetricExtensionStore,
} = getProvider(MetricExtensionStore);
