import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/pro-light-svg-icons";

type Props = ButtonProps & {
    iconFontSize?: number;
    onlyIcon?: boolean;
};

export function CloseButton({ iconFontSize = 22, onlyIcon, ...buttonProps }: Props) {
  const baseProps = onlyIcon
    ? {
        p: 0,
        bg: 'transparent',
        h: 'auto',
        w: 'auto',
        minW: 'auto',
        _hover: { color: 'gray.700' },
        _focus: { bg: 'transparent' },
      }
    : {
        pl: 0.5,
        pr: 0.5,
        h: 7,
      };

  return (
    <Button
      variant='ghost'
      size='xs'
      color='gray.500'
      aria-label='Close'
      {...baseProps}
      {...buttonProps}
    >
      <FontAwesomeIcon
        fontSize={iconFontSize}
        icon={faXmark}
      />
    </Button>
  );
}
