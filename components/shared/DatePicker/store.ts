import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';
import { DatePickerCallbacks, DatePickerProps } from './types';
import ReactDatePicker from 'react-datepicker';
import moment from 'moment';
import { KeyboardEvent, SyntheticEvent } from 'react';
import { NavigationHelper } from '../../../helpers/NavigationHelper';
import { NavigationDirections } from '../../../types/navigation';
import { DATE_FORMAT } from '../../../helpers/DateHelper';

export const DATE_PICKER_DATE_FORMAT = 'dd.MM.yyyy';

export enum EditablePosition {
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
}

export type InputParams = Record<EditablePosition, {
  edited: boolean;
  filled: boolean;
}>;

export class DatePickerStore {
  value: string;
  intermediateValue: string = 'DD.MM.YYYY';
  initialValue: string;
  callbacks: DatePickerCallbacks;

  datePickerRef: ReactDatePicker;
  inputRef: HTMLInputElement;
  isFocused: boolean = false;
  isCalendarFocused: boolean = false;
  isClickedOutside: boolean = false;
  editablePosition: EditablePosition = EditablePosition.DAY;
  nextEditablePosition: EditablePosition = EditablePosition.MONTH;
  prevEditablePosition: EditablePosition = EditablePosition.YEAR;

  selectionPositionsMap: Record<EditablePosition, [number, number]> = {
    [EditablePosition.DAY]: [0, 2],
    [EditablePosition.MONTH]: [3, 5],
    [EditablePosition.YEAR]: [6, 10],
  };
  inputParams: InputParams = {
    [EditablePosition.DAY]: {
      edited: false,
      filled: false,
    },
    [EditablePosition.YEAR]: {
      edited: false,
      filled: false,
    },
    [EditablePosition.MONTH]: {
      edited: false,
      filled: false,
    },
  };

  setSelectionTimeout: NodeJS.Timeout;

  constructor(public root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get currentValue() {
    return this.getDateFromString(this.value);
  }

  getDateFromString(value: string) {
    return value ? moment(value).toDate() : undefined;
  };

  updateInputParams = (params: Partial<InputParams>) => {
    this.inputParams = { ...this.inputParams, ...params };
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

      this.updateInputParams({
        [EditablePosition.DAY]: {
          edited: false,
          filled: false,
        },
        [EditablePosition.YEAR]: {
          edited: false,
          filled: false,
        },
        [EditablePosition.MONTH]: {
          edited: false,
          filled: false,
        },
      });
      this.editablePosition = EditablePosition.DAY;
      this.nextEditablePosition = EditablePosition.MONTH;
      this.prevEditablePosition = EditablePosition.YEAR;

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

  preventEvent = (event: SyntheticEvent | KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
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

  getWeekDayFormatByDate = (weekday: string) => {
    return weekday.substring(0, 3).toUpperCase();
  };

  setRef = (ref: ReactDatePicker) => {
    this.datePickerRef = ref;
  };

  setInputRef = (ref: HTMLInputElement) => {
    this.inputRef = ref;
  };

  changeSelection = (currPosition: number) => {
    this.updateSelection(currPosition);
    this.setSelection();
  };

  updateSelection = (currPosition: number) => {
    if (currPosition <= 2) {
      this.editablePosition = EditablePosition.DAY;
      this.nextEditablePosition = EditablePosition.MONTH;
      this.prevEditablePosition = EditablePosition.YEAR;
    } else if (currPosition > 2 && currPosition <= 5) {
      this.editablePosition = EditablePosition.MONTH;
      this.nextEditablePosition = EditablePosition.YEAR;
      this.prevEditablePosition = EditablePosition.DAY;
    } else if (currPosition > 5) {
      this.editablePosition = EditablePosition.YEAR;
      this.nextEditablePosition = EditablePosition.DAY;
      this.prevEditablePosition = EditablePosition.MONTH;
    }
  };

  setSelection = (editablePosition: EditablePosition = this.editablePosition) => {
    const [start, end] = this.selectionPositionsMap[editablePosition];

    if (editablePosition !== this.editablePosition) {
      this.updateSelection(start);
    }

    this.setSelectionTimeout = setTimeout(() => {
      this.inputRef.setSelectionRange(start, end);
    })
  };

  getValuesMap = (inputValue: string) => {
    const [inputDay, inputMonth, inputYear] = inputValue.split('.');
    const [storedDay, storedMonth, storedYear] = this.value
      ? moment(this.value).format(DATE_FORMAT).split('.')
      : this.intermediateValue.split('.');

    return {
      [EditablePosition.DAY]: {
        inputValue: inputDay,
        storedValue: storedDay
      },
      [EditablePosition.MONTH]: {
        inputValue: inputMonth,
        storedValue: storedMonth
      },
      [EditablePosition.YEAR]: {
        inputValue: inputYear,
        storedValue: storedYear
      }
    };
  }

  handleInputValueChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;

    this.updateSelection(input.selectionStart);
    this.setSelection();

    if (this.value && !/(\d|D){1,2}\.(\d|M){1,2}\.(\d|Y){1,4}/.test(input.value)) {
      return;
    }

    let shouldMoveToNextPosition = false;
    const valuesMap = this.getValuesMap(input.value);

    const additionalZeros = this.editablePosition === EditablePosition.YEAR ? '0000' : '00';
    const currentValue =
      this.inputParams[this.editablePosition].edited &&
      !this.inputParams[this.editablePosition].filled
        ? `${additionalZeros}${valuesMap[this.editablePosition].storedValue}`.slice(-additionalZeros.length)
        : additionalZeros;

    const formattedValue = `${currentValue}${valuesMap[this.editablePosition].inputValue}`.slice(-additionalZeros.length);

    let correctDay = valuesMap[EditablePosition.DAY].inputValue;
    let correctMonth = valuesMap[EditablePosition.MONTH].inputValue;
    let correctYear = valuesMap[EditablePosition.YEAR].inputValue;

    if (this.editablePosition === EditablePosition.DAY) {
      const daysInMonth = correctMonth !== 'MM' && correctYear !== 'YYYY'
        ? moment(`${correctYear}-${correctMonth}`, 'YYYY-MM').daysInMonth()
        : 31;

      const formattedDay = Number(formattedValue) ? formattedValue : '1';
      correctDay = Number(formattedDay) <= daysInMonth ? formattedDay : daysInMonth.toString();

      if ((correctDay[0] !== '0' || Number(formattedDay) > Number(daysInMonth.toString()[0])) && correctDay.length === 2) {
        shouldMoveToNextPosition = true;
      }
    } else {
      if (this.editablePosition === EditablePosition.MONTH) {
        const formattedMonth = Number(formattedValue) ? formattedValue : '1';
        correctMonth = Number(formattedMonth) <= 12 ? formattedMonth : `0${formattedValue[1]}`;

        if ((correctMonth[0] !== '0' && correctMonth.length === 2) || Number(correctMonth) > 1) {
          shouldMoveToNextPosition = true;
        }
      } else if (this.editablePosition === EditablePosition.YEAR) {
        correctYear = formattedValue;
      }

      const daysInMonth = correctMonth !== 'MM' && correctYear !== 'YYYY'
        ? moment(`${correctYear}-${correctMonth}`, 'YYYY-MM').daysInMonth()
        : 31;
      correctDay = Number(correctDay) > daysInMonth ? daysInMonth.toString() : correctDay;
    }

    this.updateInputParams({
      [this.editablePosition]: {
        filled: !String(formattedValue).includes('0') || shouldMoveToNextPosition,
        edited: true,
      },
    });

    const finalValue = `${correctDay}.${correctMonth}.${correctYear}`;

    if (!this.value) {
      this.intermediateValue = finalValue;
    }

    if (this.value || !/[a-zA-Z]/.test(finalValue)) {
      this.handleChange(moment(finalValue, DATE_FORMAT).toDate());
      this.intermediateValue = 'DD.MM.YYYY';
    }

    if (shouldMoveToNextPosition) {
      this.setSelection(this.nextEditablePosition);
    }
  }

  onInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  ) => {
    if (
      ((event.key === 'Tab' && !event.shiftKey) || event.key === 'ArrowRight') &&
      this.editablePosition !== EditablePosition.YEAR
    ) {
      this.preventEvent(event);
      this.setSelection(this.nextEditablePosition);
    } else if (
      ((event.key === 'Tab' && event.shiftKey) || event.key === 'ArrowLeft') &&
      this.editablePosition !== EditablePosition.DAY
    ) {
      this.preventEvent(event);
      this.setSelection(this.prevEditablePosition);
    } else if (event.key === 'Enter') {
      this.preventEvent(event);
      this.handleSave(this.value);
      this.datePickerRef.setOpen(false);
    } else {
      onKeyDown?.(event);
    }
  };

  onInputClick = (event: SyntheticEvent<HTMLInputElement>) => {
    this.preventEvent(event);
    this.changeSelection((event.target as HTMLInputElement).selectionStart);
  };

  update = ({ value, onFocusToggle, onChanged, onNavigate }: DatePickerProps) => {
    this.value = value;
    this.initialValue = value;
    this.callbacks = { onChanged, onFocusToggle, onNavigate };
  };

  destroy = () => {
    clearTimeout(this.setSelectionTimeout);
  };
}

export const {
  useStore: useDatePickerStore,
  StoreProvider: DatePickerStoreProvider
} = getProvider(DatePickerStore);
