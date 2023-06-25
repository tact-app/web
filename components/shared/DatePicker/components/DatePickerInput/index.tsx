import React, { forwardRef, InputHTMLAttributes, KeyboardEvent, useEffect } from 'react';
import { useRefWithCallback } from '../../../../../helpers/useRefWithCallback';
import { observer } from 'mobx-react-lite';
import { useDatePickerStore } from '../../store';
import { chakra } from '@chakra-ui/react';

export const DatePickerInput = observer(
  forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    function DatePickerInput(props, inputRef) {
      const store = useDatePickerStore();
      const ref = useRefWithCallback(inputRef, store.setInputRef);

      useEffect(() => {
        if (store.editablePosition) {
          store.setSelection();
        }
      }, [store.editablePosition, store]);

      const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        store.onInputKeyDown(event, props.onKeyDown);
      };

      return (
        <div className='input-wrapper'>
          <chakra.input
            ref={ref}
            {...props}
            value={props.value || (store.isFocused ? store.intermediateValue : '')}
            onChange={undefined}
            onInput={store.handleInputValueChange}
            onMouseUp={store.onInputClick}
            onKeyDown={onKeyDown}
            onDoubleClick={store.handleAreaEvent}
          />
        </div>
      );
    }
  )
);
