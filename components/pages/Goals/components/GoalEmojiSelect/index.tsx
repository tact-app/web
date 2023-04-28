import { EmojiSelect } from "../../../../shared/EmojiSelect";
import { chakra } from '@chakra-ui/react'
import React, { forwardRef } from "react";
import { EmojiSelectProps } from "../../../../shared/EmojiSelect/types";
import { GoalData, GoalStatus } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GOALS_STATUSES_COLORS, GOALS_STATUSES_ICONS } from "../../constants";
import { observer } from "mobx-react-lite";

type Props = Omit<EmojiSelectProps, 'icon' | 'color'> & {
  goal: GoalData;
  statusIconBottom?: number;
  statusIconRight?: number;
};

export const GoalEmojiSelect = observer(forwardRef<HTMLButtonElement, Props>(
    function GoalEmojiSelect(
      {
         goal,
         statusIconBottom = -1,
         statusIconRight = -1,
         ...emojiSelectProps
      },
      ref
    ) {
      return (
          <chakra.div position='relative'>
            <EmojiSelect
                ref={ref}
                icon={goal.icon.value}
                color={goal.icon.color}
                {...emojiSelectProps}
            />

            {goal.status !== GoalStatus.TODO && (
                <chakra.span
                    position='absolute'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    background='white'
                    borderRadius='50%'
                    boxShadow='0px 2px 3px rgba(99, 99, 99, 0.09)'
                    color={GOALS_STATUSES_COLORS[goal.status]}
                    w={5}
                    h={5}
                    bottom={statusIconBottom}
                    right={statusIconRight}
                >
                  <FontAwesomeIcon icon={GOALS_STATUSES_ICONS[goal.status]} fontSize={14}/>
                </chakra.span>
            )}
          </chakra.div>
      );
    }
));
