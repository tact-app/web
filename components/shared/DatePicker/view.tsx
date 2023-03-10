import React from 'react';
import { observer } from "mobx-react-lite";
import ReactDatePicker from 'react-datepicker';
import { Flex, chakra } from "@chakra-ui/react";
import { faCalendarLines, faCalendarCirclePlus } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePickerViewProps } from "./types";
import { DATE_PICKER_DATE_FORMAT, useDatePickerStore } from "./store";
import { DatePickerHeader } from "./components/DatePickerHeader";

export const DatePickerView = observer(
  function DatePickerView({ showIconOnlyIfEmpty, iconFontSize = 20, ...flexProps }: DatePickerViewProps) {
    const store = useDatePickerStore();

    const mustShowIcon = !showIconOnlyIfEmpty || (!store.value && !store.isFocused);

    return (
      <Flex alignItems='center' {...flexProps}>
        {mustShowIcon && (
          <chakra.div tabIndex={-1} pr={store.isFocused ? '0.2rem' : 2}>
            <FontAwesomeIcon
              id='test'
              tabIndex={-1}
              color={`var(--chakra-colors-${(store.isFocused ? 'blue' : 'gray') + '-500'})`}
              fontSize={iconFontSize}
              icon={store.isFocused ? faCalendarCirclePlus : faCalendarLines}
              style={{ outlineWidth: 0 }}
              cursor='pointer'
              onClick={store.handleIconClick}
            />
          </chakra.div>
        )}
        <ReactDatePicker
          renderCustomHeader={DatePickerHeader}
          formatWeekDay={store.getWeekDayFormatByDate}
          dateFormat={DATE_PICKER_DATE_FORMAT}
          selected={store.currentValue}
          onChange={store.handleChange}
          portalId="date-picker-portal"
          placeholderText={!store.value && store.isFocused ? 'DD.MM.YYYY' : ''}
          onFocus={store.handleFocus}
          onBlur={store.handleBlur}
          onClickOutside={store.handleClickOutside}
          ref={store.setRef}
        />
      </Flex>
    );
  }
);
