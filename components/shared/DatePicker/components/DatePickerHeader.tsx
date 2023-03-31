import { ReactDatePickerCustomHeaderProps } from "react-datepicker";
import moment from "moment/moment";
import { chakra, Flex } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/pro-light-svg-icons";
import React from "react";
import { IconDefinition } from "@fortawesome/pro-solid-svg-icons";

export function DatePickerHeader({ monthDate, changeMonth }: ReactDatePickerCustomHeaderProps) {
  const date = moment(monthDate);
  const monthNum = monthDate.getMonth();

  const renderIcon = ({ icon, onClick }: { icon: IconDefinition, onClick(): void }) => (
    <FontAwesomeIcon
      cursor='pointer'
      fontSize={20}
      color='var(--chakra-colors-gray-400)'
      icon={icon}
      onClick={onClick}
    />
  );

  return (
    <Flex alignItems='center' justifyContent='center' mb={4}>
      {renderIcon({
        icon: faAngleLeft,
        onClick: () => changeMonth(monthNum - 1)
      })}
      <chakra.span
        color='gray.700'
        fontWeight='medium'
        lineHeight={5}
        ml={4}
        mr={4}
      >
        {date.format('MMMM YYYY')}
      </chakra.span>
      {renderIcon({
        icon: faAngleRight,
        onClick: () => changeMonth(monthNum + 1)
      })}
    </Flex>
  )
}
