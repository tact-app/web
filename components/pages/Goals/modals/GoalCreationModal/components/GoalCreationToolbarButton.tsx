import React from 'react';
import { Button } from '@chakra-ui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/pro-solid-svg-icons";
import { Tooltip } from "../../../../../shared/Tooltip";

type Props = {
  onClick?(): void,
  icon: IconDefinition;
  withMargin?: boolean ;
  iconFontSize?: number;
  tooltipLabel?: string;
  tooltipHotkey?: string;
  disableTooltip?: boolean;
};

export function GoalCreationToolbarButton({
  onClick,
  icon,
  withMargin,
  iconFontSize = 20,
  tooltipHotkey,
  tooltipLabel,
  disableTooltip,
}: Props) {
  const content = (
    <Button
      variant='ghost'
      size='xs'
      color='gray.500'
      pl={0.5}
      pr={0.5}
      h={7}
      ml={withMargin ? 0.5 : 0}
      aria-label={tooltipLabel}
      onClick={onClick}
    >
      <FontAwesomeIcon
        fontSize={iconFontSize}
        icon={icon}
        fixedWidth
      />
    </Button>
  );

  if (disableTooltip) {
    return content;
  }

  return (
    <Tooltip label={tooltipLabel} hotkey={tooltipHotkey}>
      {content}
    </Tooltip>
  );
}
