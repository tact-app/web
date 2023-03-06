import React, { useState, useRef } from 'react';
import ReactDatePicker, { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import { Flex, chakra } from "@chakra-ui/react";
import { faCalendarCirclePlus, faAngleLeft, faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

type Props = {
  value: string;
  showIconOnlyIfEmpty?: boolean;
  onChange(value: string): void;
  onFocus?(): void;
  onBlur?(): void;
}

export function DatePicker({ value, showIconOnlyIfEmpty, onChange, onFocus, onBlur }: Props) {
  const ref = useRef<ReactDatePicker>();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };
  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };
  const handleChange = (date: Date) => {
    onChange(date.toISOString());
    handleBlur();
  };

  const handleIconClick = () => {
    if (isFocused) {
      ref.current?.setBlur();
    } else {
      ref.current?.setFocus();
    }
  };


  const renderHeader = ({ monthDate, changeMonth }: ReactDatePickerCustomHeaderProps) => {
    const date = moment(monthDate);
    const monthNum = monthDate.getMonth();

    return (
      <Flex alignItems='center' justifyContent='center' mb={4}>
        <FontAwesomeIcon
          cursor='pointer'
          fontSize={20}
          color='var(--chakra-colors-gray-400)'
          icon={faAngleLeft}
          onClick={() => changeMonth(monthNum - 1)}
        />
        <chakra.span
          color='gray.700'
          fontWeight='medium'
          lineHeight={5}
          ml={4}
          mr={4}
        >
          {date.format('MMMM YYYY')}
        </chakra.span>
        <FontAwesomeIcon
          cursor='pointer'
          fontSize={20}
          color='var(--chakra-colors-gray-400)'
          icon={faAngleRight}
          onClick={() => changeMonth(monthNum + 1)}
        />
      </Flex>
    )
  };

  return (
    <Flex alignItems='center'>
      {(!showIconOnlyIfEmpty || !value || !isFocused) && (
        <chakra.div tabIndex={-1} padding='0 7px 0 5px' cursor='pointer'>
          <FontAwesomeIcon
            tabIndex={-1}
            color={`var(--chakra-colors-${(isFocused ? 'blue' : 'gray') + '-500'})`}
            fontSize={20}
            icon={faCalendarCirclePlus}
            style={{ outlineWidth: 0 }}
            onClick={handleIconClick}
          />
        </chakra.div>
      )}
      <ReactDatePicker
        renderCustomHeader={renderHeader}
        formatWeekDay={(day) => moment(day).format('ddd').toUpperCase()}
        dateFormat='dd.MM.yyyy'
        selected={value ? new Date(value) : undefined}
        onChange={handleChange}
        portalId="date-picker-portal"
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={ref}
      />
    </Flex>
  );
}
