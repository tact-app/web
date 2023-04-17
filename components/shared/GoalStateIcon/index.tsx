import { Flex, chakra, FlexProps, Tooltip } from '@chakra-ui/react';
import {
    faAlarmClock,
    faCalendarCircleExclamation,
    faCalendarClock,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { GoalState } from "../../pages/Goals/types";

type Props = FlexProps & {
    state: GoalState;
    iconFontSize?: number;
};

export const GOAL_STATE_PARAMS = {
    [GoalState.IS_COMING]: {
        color: 'green.400',
        icon: faAlarmClock,
        tooltipTitle: 'Is coming soon',
    },
    [GoalState.TIME_TO_ACHIEVE]: {
        color: 'orange.400',
        icon: faCalendarCircleExclamation,
        tooltipTitle: <>Time to achieve this goal<br/>is coming to an end</>,
    },
    [GoalState.END_DATE_ALREADY_PASSED]: {
        color: 'red.400',
        icon: faCalendarClock,
        tooltipTitle: <>The end date for the goal<br/>has already passed</>,
    },
};

export function GoalStateIcon({ state, iconFontSize = 14, ...flexProps }: Props) {
    const { tooltipTitle, icon, color } = GOAL_STATE_PARAMS[state];

    return (
        <Tooltip
            label={
                <chakra.span display='flex' fontSize='xs' fontWeight='normal' textAlign='center'>
                    {tooltipTitle}
                </chakra.span>
            }
            placement='top'
            offset={[0, 10]}
            hasArrow
        >
            <Flex
                color={color}
                display='flex'
                alignItems='center'
                justifyContent='center'
                {...flexProps}
            >
                <FontAwesomeIcon fontSize={iconFontSize} icon={icon} />
            </Flex>
        </Tooltip>
    );
}
