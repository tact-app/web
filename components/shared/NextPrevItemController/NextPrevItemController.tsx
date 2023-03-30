import React from 'react';
import { observer } from "mobx-react-lite";
import { Flex, IconButton } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown as faAngleDownLight,
  faAngleUp as faAngleUpLight
} from "@fortawesome/pro-light-svg-icons";
import {
  faAngleDown as faAngleDownSolid,
  faAngleUp as faAngleUpSolid
} from "@fortawesome/pro-solid-svg-icons";

type Props = {
  hasPreviousItem?: boolean;
  hasNextItem?: boolean;
  iconFontSize?: number;
  color?: string;
  iconStyle?: 'solid' | 'light';
  onNextItem?(): void;
  onPrevItem?(): void;
};

export const NextPrevItemController = observer(
  function NextPrevItemController({
    hasNextItem,
    hasPreviousItem,
    iconFontSize = 16,
    color = 'gray.400',
    iconStyle = 'solid',
    onPrevItem,
    onNextItem,
  }: Props) {
    const getNextIcon = () => {
      switch (iconStyle) {
        case 'light':
          return faAngleUpLight;
        case 'solid':
        default:
          return faAngleUpSolid;
      }
    };
    const getPrevIcon = () => {
      switch (iconStyle) {
        case 'light':
          return faAngleDownLight;
        case 'solid':
        default:
          return faAngleDownSolid;
      }
    };

    return (
      <Flex color={color}>
        {Boolean(onNextItem) && (
          <IconButton
            aria-label='Next'
            size='xs'
            isDisabled={!hasNextItem}
            variant='ghost'
            onClick={onNextItem}
          >
            <FontAwesomeIcon
              fontSize={iconFontSize}
              icon={getNextIcon()}
              fixedWidth
            />
          </IconButton>
        )}
        {Boolean(onPrevItem) && (
          <IconButton
            aria-label='Prev'
            size='xs'
            isDisabled={!hasPreviousItem}
            variant='ghost'
            mr={0.5}
            onClick={onPrevItem}
          >
            <FontAwesomeIcon
              fontSize={iconFontSize}
              icon={getPrevIcon()}
              fixedWidth
            />
          </IconButton>
        )}
      </Flex>
    )
  }
);
