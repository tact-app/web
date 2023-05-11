import React, { forwardRef, InputHTMLAttributes } from 'react';
import { useRefWithCallback } from '../../../../../helpers/useRefWithCallback';
import { observer } from 'mobx-react-lite';
import { useDatePickerStore } from '../../store';

export const DatePickerInput = observer(
  forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    function DatePickerInput(props, inputRef) {
      const store = useDatePickerStore();
      const ref = useRefWithCallback(inputRef, store.setInputRef);

      return (
        <div className='input-wrapper'>
          <input ref={ref} {...props} />
        </div>
      );
    }
  )
);
