import React from 'react';
import { observer } from "mobx-react-lite";
import ReactDatePicker from 'react-datepicker';
import { Flex, chakra } from "@chakra-ui/react";
import { faCalendarCirclePlus } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePickerViewProps } from "./types";
import { DATE_PICKER_DATE_FORMAT, useDatePickerStore } from "./store";
import { DatePickerHeader } from "./components/DatePickerHeader";
import { Tooltip } from '../Tooltip';
import cn from 'classnames';

export const DatePickerView = observer(
  function DatePickerView({
    showIconOnlyIfEmpty,
    iconFontSize = 20,
    selectsStart,
    selectsEnd,
    startDate,
    endDate,
    minDate,
    showTooltip,
    tooltipPlacement = 'top',
    ...flexProps
  }: DatePickerViewProps) {
    const store = useDatePickerStore();

    const mustShowIcon = !showIconOnlyIfEmpty || (!store.currentValue && !store.isFocused);

    return (
      <Flex alignItems='center' {...flexProps}>
        {mustShowIcon && (
          <Tooltip
            label='Add date'
            isDisabled={!showTooltip || store.isFocused}
            placement={tooltipPlacement}
          >
            <chakra.div
              tabIndex={-1}
              color={store.isFocused ? 'blue.500' : 'gray.500'}
              _hover={{ color: 'blue.400' }}
            >
              <FontAwesomeIcon
                tabIndex={-1}
                fontSize={iconFontSize}
                icon={faCalendarCirclePlus}
                style={{ outline: 'none' }}
                cursor='pointer'
                onClick={store.handleIconClick}
              />
            </chakra.div>
          </Tooltip>
        )}
        <ReactDatePicker
          wrapperClassName={cn({ 'only-icon': showIconOnlyIfEmpty, 'disabled': showIconOnlyIfEmpty && mustShowIcon })}
          renderCustomHeader={DatePickerHeader}
          formatWeekDay={store.getWeekDayFormatByDate}
          dateFormat={DATE_PICKER_DATE_FORMAT}
          selected={store.currentValue}
          onChange={store.handleChange}
          portalId="date-picker-portal"
          placeholderText={!store.currentValue && store.isFocused ? 'DD.MM.YYYY' : ''}
          onFocus={store.handleFocus}
          onBlur={store.handleBlur}
          onClickOutside={store.handleClickOutside}
          ref={store.setRef}
          selectsStart={selectsStart}
          selectsEnd={selectsEnd}
          startDate={store.getDateFromString(startDate)}
          endDate={store.getDateFromString(endDate)}
          minDate={store.getDateFromString(minDate)}
          className={store.isFocused ? 'datepicker-focused' : ''}
          renderDayContents={(dayOfMonth) => (
            <>
              <span className='day-backdrop' />
              <div className='day'>{dayOfMonth}</div>
            </>
          )}
        />
      </Flex>
    );
  }
);
