import { FlexProps } from "@chakra-ui/react";

export type DatePickerContainerProps = Omit<FlexProps, 'onChange' | 'onFocus' | 'onBlur'>;

export type DatePickerCallbacks = {
  onChange(value: string): void;
  onFocus?(): void;
  onBlur?(): void;
};

export type DatePickerViewProps = DatePickerContainerProps & {
  showIconOnlyIfEmpty?: boolean;
  iconFontSize?: number;
  selectsStart?: boolean;
  selectsEnd?: boolean;
  minDate?: string;
  startDate?: string;
  endDate?: string;
}

export type DatePickerProps = DatePickerCallbacks & DatePickerViewProps & {
  value: string;
};
