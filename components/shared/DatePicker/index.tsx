import { observer } from 'mobx-react-lite';
import { DatePickerProps } from './types';
import { DatePickerStoreProvider } from './store';
import { DatePickerView } from './view';

export const DatePicker = observer(function DatePicker(props: DatePickerProps) {
  return (
    <DatePickerStoreProvider {...props}>
      <DatePickerView {...props} />
    </DatePickerStoreProvider>
  );
});
