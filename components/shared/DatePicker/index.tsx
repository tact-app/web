import { observer } from 'mobx-react-lite';
import { DatePickerProps } from './types';
import { DatePickerStoreProvider } from './store';
import { DatePickerView } from './view';
import React, { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';

export const DatePicker = observer(forwardRef<ReactDatePicker, DatePickerProps>(
  function DatePicker(props, ref) {
    return (
      <DatePickerStoreProvider {...props}>
        <DatePickerView {...props} ref={ref} />
      </DatePickerStoreProvider>
    );
  }
));
