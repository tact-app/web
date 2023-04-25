import { Button } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/pro-light-svg-icons";
import { Tooltip } from "../Tooltip";
import React, { ReactNode } from "react";

type Props = {
  tooltipLabel: ReactNode;
  iconFontSize?: number;
};

export function QuestionWithTooltip({ tooltipLabel, iconFontSize = 14 }: Props) {
  return (
    <Tooltip label={tooltipLabel} textAlign='center' maxW='380'>
      <Button
        variant='unstyled'
        minW='auto'
        minH='auto'
        height='auto'
        color='gray.500'
        _hover={{ color: 'blue.400' }}
        ml={1}
      >
        <FontAwesomeIcon
          fontSize={iconFontSize}
          icon={faQuestionCircle}
          fixedWidth
        />
      </Button>
    </Tooltip>
  );
}
