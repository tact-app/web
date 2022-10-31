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

  handleFocus = () => {
    clearTimeout(this.focusTimeout);

    this.isFocused = true;
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
  };
}

export const {
  StoreProvider: MetricExtensionStoreProvider,
  useStore: useMetricExtensionStore,
} = getProvider(MetricExtensionStore);
