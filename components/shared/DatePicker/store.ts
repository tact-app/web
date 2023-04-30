import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from "../../../helpers/StoreProvider";
import { DatePickerCallbacks, DatePickerProps } from "./types";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import { SyntheticEvent, KeyboardEvent } from "react";

export const DATE_PICKER_DATE_FORMAT = 'dd.MM.yyyy';

export class DatePickerStore {
  value: string;
  callbacks: DatePickerCallbacks;

  datePickerRef: ReactDatePicker;
  inputRef: HTMLInputElement;
  isFocused = false;
  isClickedOutside = false;

  constructor(public root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get currentValue() {
    return this.getDateFromString(this.value);
  }

  getDateFromString(value: string) {
    return value ? moment(value).toDate() : undefined;
  };

  handleFocus = () => {
    if (!this.isFocused) {
      this.isFocused = true;
      this.callbacks?.onFocusToggle?.(true);
    }
  };

  handleBlur = () => {
    if (this.isFocused) {
      this.isFocused = false
      this.callbacks?.onFocusToggle?.(false);
    }
  };

  handleChange = (date: Date) => {
    this.callbacks?.onChanged(date?.toISOString() ?? '');
    this.handleBlur();
  };

  handleAreaEvent = (e: SyntheticEvent | KeyboardEvent) => {
    e.stopPropagation();
  };

  handleKeyDown = (e: KeyboardEvent) => {
    this.handleAreaEvent(e);

    if (this.inputRef === document.activeElement) {
      console.log(e.key, this.inputRef.selectionStart)
    }
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
  };

  getWeekDayFormatByDate = (date: Date) => {
    return moment(date).format('ddd').toUpperCase();
  };

  setRef = (ref: ReactDatePicker) => {
    this.datePickerRef = ref;
  };

  setInputRef = (ref: HTMLInputElement) => {
    this.inputRef = ref;
  };

  update = ({ value, onFocusToggle, onChanged }: DatePickerProps) => {
    this.value = value;
    this.callbacks = { onChanged, onFocusToggle };
  };
}

export const {
  useStore: useDatePickerStore,
  StoreProvider: DatePickerStoreProvider
} = getProvider(DatePickerStore);
