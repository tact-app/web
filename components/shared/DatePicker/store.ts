import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';
import { DatePickerCallbacks, DatePickerProps } from './types';
import ReactDatePicker from 'react-datepicker';
import moment from 'moment';
import { KeyboardEvent, SyntheticEvent } from 'react';
import { NavigationHelper } from '../../../helpers/NavigationHelper';
import { NavigationDirections } from '../../../types/navigation';

export const DATE_PICKER_DATE_FORMAT = 'dd.MM.yyyy';

export class DatePickerStore {
  value: string;
  initialValue: string;
  callbacks: DatePickerCallbacks;

  datePickerRef: ReactDatePicker;
  inputRef: HTMLInputElement;
  isFocused = false;
  isCalendarFocused = false;
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

  handleBlur = (toggleFocus: boolean = true) => {
    if (this.isFocused) {
      this.isFocused = false;
      this.isCalendarFocused = false;

      if (toggleFocus) {
        this.callbacks?.onFocusToggle?.(false);
      }
    }
  };

  handleInputClick = () => {
    this.datePickerRef.setFocus();
    this.isCalendarFocused = false;
  };

  handleChange = (date: Date) => {
    this.value = date?.toISOString() ?? '';
  };

  handleSave = (value: string = this.value, toggleFocus: boolean = true) => {
    this.value = value;
    this.isCalendarFocused = false;
    this.callbacks?.onChanged(value);

    if (toggleFocus) {
      this.handleBlur(toggleFocus);
    }
  };

  handleSelect = (date: Date) => {
    this.handleChange(date);
    this.handleSave();
  };

  handleAreaEvent = (e: SyntheticEvent | KeyboardEvent) => {
    e.stopPropagation();
  };

  handleKeyDown = (e: KeyboardEvent) => {
    this.handleAreaEvent(e);

    if (e.key === 'Tab') {
      this.isCalendarFocused = false;
      this.datePickerRef?.setOpen(false);
    }

    const direction = NavigationHelper.castKeyToDirection(e.key, e.shiftKey);

    if (direction === NavigationDirections.ENTER) {
      this.handleSave();
    } else if (
      this.callbacks.onNavigate && (
        e.key === 'Tab' ||
        direction === NavigationDirections.INVARIANT || (
          this.inputRef === document.activeElement && (
            (
              direction === NavigationDirections.LEFT &&
              !this.inputRef.selectionStart
            ) ||
            (
              direction === NavigationDirections.RIGHT &&
              (
                (this.inputRef.selectionStart === DATE_PICKER_DATE_FORMAT.length) ||
                (!this.inputRef.selectionStart && !this.value.length)
              )
            )
          )
        )
      )
    ) {
      this.handleSave(this.initialValue, false);
      this.callbacks.onNavigate(direction, e);
    } else if ([NavigationDirections.DOWN, NavigationDirections.UP].includes(direction)) {
      this.isCalendarFocused = true;
    }
  };

  handleIconClick = () => {
    if (this.isFocused || this.isClickedOutside) {
      this.datePickerRef?.setBlur();
      this.isClickedOutside = false;
      this.isCalendarFocused = false;
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

  update = ({ value, onFocusToggle, onChanged, onNavigate }: DatePickerProps) => {
    this.value = value;
    this.initialValue = value;
    this.callbacks = { onChanged, onFocusToggle, onNavigate };
  };
}

export const {
  useStore: useDatePickerStore,
  StoreProvider: DatePickerStoreProvider
} = getProvider(DatePickerStore);
