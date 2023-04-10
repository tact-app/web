import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { ListNavigation } from '../../../helpers/ListNavigation';
import { CheckboxGroupCallbacks, CheckboxGroupItem, CheckboxGroupProps } from './types';

export class CheckboxGroupStore {
  value?: string;
  error?: string;
  title?: string;
  items: CheckboxGroupItem[] = [];
  callbacks: CheckboxGroupCallbacks;
  navigation = new ListNavigation();

  constructor() {
    makeAutoObservable(this);
  }

  handleChange = (item: CheckboxGroupItem) => {
    this.callbacks?.onChange?.(item.value);
  };

  update = ({
    value,
    items,
    error,
    title,
    customListNavigation,
    onChange,
  }: CheckboxGroupProps) => {
    this.value = value;
    this.items = items;
    this.error = error;
    this.title = title;

    if (customListNavigation) {
      this.navigation = customListNavigation;
    }

    this.callbacks = {
      onChange,
    };
  };
}

export const {
  StoreProvider: CheckboxGroupStoreProvider,
  useStore: useCheckboxGroupStore,
} = getProvider(CheckboxGroupStore);
