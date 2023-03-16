import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from "../../../helpers/StoreProvider";
import { DatePickerCallbacks, DatePickerProps } from "./types";
import ReactDatePicker from "react-datepicker";
import moment from "moment/moment";
import { SyntheticEvent } from "react";

export const DATE_PICKER_DATE_FORMAT = 'dd.MM.yyyy';

export class DatePickerStore {
  value: string;
  callbacks: DatePickerCallbacks;

  datePickerRef: ReactDatePicker;
  isFocused = false;
  isClickedOutside = false;

  constructor(public root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get currentValue() {
    return this.value ? moment(this.value).toDate() : undefined
  }

  handleFocus = () => {
    if (!this.isFocused) {
      this.isFocused = true;
      this.callbacks?.onFocus?.();
    }
  };

  handleBlur = () => {
    if (this.isFocused) {
      this.isFocused = false
      this.callbacks?.onBlur?.();
    }
  };

  handleChange = (date: Date) => {
    this.callbacks?.onChange(date?.toISOString() ?? '');
    this.handleBlur();
  };

  handleIconClick = () => {
    if (this.isFocused || this.isClickedOutside) {
      this.datePickerRef?.setBlur();
      this.isClickedOutside = false;
    } else {
      this.datePickerRef?.setFocus();
    }
  };

  handleClickOutside = (event: SyntheticEvent) => {
    const targetTagName = ['svg', 'path'].includes((event.target as HTMLElement).tagName);

    if (this.isFocused && targetTagName) {
      this.isClickedOutside = true;
    }
  }

  getWeekDayFormatByDate = (date: Date) => {
    return moment(date).format('ddd').toUpperCase();
  }

  setRef = (ref: ReactDatePicker) => {
    this.datePickerRef = ref;
  }

  update = ({ value, onBlur, onFocus, onChange }: DatePickerProps) => {
    this.value = value;
    this.callbacks = {
      onChange,
      onFocus,
      onBlur
    };
  }
}

export const {
  useStore: useDatePickerStore,
  StoreProvider: DatePickerStoreProvider
} = getProvider(DatePickerStore);
