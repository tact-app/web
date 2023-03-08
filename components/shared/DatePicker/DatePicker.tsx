import React, { useState, useRef } from 'react';
import ReactDatePicker, { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import { Flex, chakra, FlexProps } from "@chakra-ui/react";
import { faCalendarCirclePlus, faAngleLeft, faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

type Props = Omit<FlexProps, 'onChange' | 'onFocus' | 'onBlur'> & {
  value: string;
  showIconOnlyIfEmpty?: boolean;
  iconFontSize?: number;
  onChange(value: string): void;
  onFocus?(): void;
  onBlur?(): void;
}

export function DatePicker({
  value,
  showIconOnlyIfEmpty,
  iconFontSize = 20,
  onChange,
  onFocus,
  onBlur,
  ...flexProps
}: Props) {
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
    <Flex alignItems='center' {...flexProps}>
      {(!showIconOnlyIfEmpty || (!value && !isFocused)) && (
        <chakra.div tabIndex={-1} pr={1.5} cursor='pointer'>
          <FontAwesomeIcon
            tabIndex={-1}
            color={`var(--chakra-colors-${(isFocused ? 'blue' : 'gray') + '-500'})`}
            fontSize={iconFontSize}
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
