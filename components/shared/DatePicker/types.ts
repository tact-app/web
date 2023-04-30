import { FlexProps, TooltipProps } from "@chakra-ui/react";

export type DatePickerContainerProps = Omit<FlexProps, 'onChange' | 'onFocus' | 'onBlur'>;

export type DatePickerCallbacks = {
  onChanged(value: string): void;
  onFocusToggle?(isFocused: boolean): void;
};

export type DatePickerViewProps = DatePickerContainerProps & {
  showIconOnlyIfEmpty?: boolean;
  iconFontSize?: number;
  selectsStart?: boolean;
  selectsEnd?: boolean;
  minDate?: string;
  startDate?: string;
  endDate?: string;
  showTooltip?: boolean;
  tabIndex?: number;
  tooltipPlacement?: TooltipProps['placement'];
}

export type DatePickerProps = DatePickerCallbacks & DatePickerViewProps & {
  value: string;
};
