import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { ListNavigation } from '../../../helpers/ListNavigation';
import { CheckboxGroupProps, CheckboxGroupCallbacks, CheckboxGroupItem } from './types';

const CHECKBOX_GROUP_ERRORS = {
  required: 'The field is required'
};

export class CheckboxGroupStore {
  value?: string;
  isSubmitted?: boolean;
  isRequired?: boolean;
  items: CheckboxGroupItem[] = [];
  callbacks: CheckboxGroupCallbacks;
  navigation = new ListNavigation();

  constructor() {
    makeAutoObservable(this);
  }

  get errors() {
    if (!this.isSubmitted) {
      return {};
    }

    const errors = {} as Partial<typeof CHECKBOX_GROUP_ERRORS>;

    if (this.isRequired && !this.value) {
      errors.required = CHECKBOX_GROUP_ERRORS.required;
    }

    return errors;
  }

  get errorToDisplay() {
    return Object.values(this.errors)[0];
  }

  get isInvalid() {
    return Boolean(Object.keys(this.errors).length);
  }

  handleChange = (item: CheckboxGroupItem) => {
    this.callbacks?.onChange?.(item.value);
  };

  update = ({
    value,
    items,
    isSubmitted,
    required,
    customListNavigation,
    onChange,
  }: CheckboxGroupProps) => {
    this.value = value;
    this.items = items;
    this.isSubmitted = Boolean(isSubmitted);
    this.isRequired = Boolean(required);

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
