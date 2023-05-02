import { observer } from 'mobx-react-lite';
import { chakra, Button } from '@chakra-ui/react';
import { useGoalCreationModalStore } from '../store';
import React, { KeyboardEvent } from "react";
import { GoalStatus } from "../../../types";
import {
  GOALS_STATUSES_COMMANDS,
  GOALS_STATUSES_HOTKEYS,
  GOALS_STATUSES_TITLES
} from "../constants";
import { Tooltip } from "../../../../../shared/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionMenu } from "../../../../../shared/ActionMenu";
import { GOALS_STATUSES_ICONS, GOALS_STATUSES_COLORS } from '../../../constants';

export const GoalCreationStatusSelect = observer(
  function GoalCreationStatusSelect() {
    const store = useGoalCreationModalStore();

    const actions = [GoalStatus.TODO, GoalStatus.DONE, GoalStatus.WONT_DO].map((status) => ({
      icon: GOALS_STATUSES_ICONS[status],
      title: (
        <chakra.span color={store.goal.status === status ? 'blue.400' : 'initial'}>
          {GOALS_STATUSES_TITLES[status]}
        </chakra.span>
      ),
      key: status,
      onClick: () => store.handleUpdateStatus(status),
      command: GOALS_STATUSES_COMMANDS[status],
      hotkey: GOALS_STATUSES_HOTKEYS[status],
      iconColor: GOALS_STATUSES_COLORS[status],
    }));

    const handleContainerKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
      }
    };

    return (
      <div onKeyDown={handleContainerKeyDown}>
        <ActionMenu
          instance={store.selectStatus}
          items={actions}
          menuMinWidth={44}
          customTrigger={(isOpen) => (
            <div>
              <Tooltip label='Change status' hotkey='S' isDisabled={isOpen}>
                <Button
                  variant='ghost'
                  size='xs'
                  color={GOALS_STATUSES_COLORS[store.goal.status]}
                  pl={1}
                  pr={2}
                  h={7}
                  bg={isOpen ? 'gray.75' : 'initial'}
                >
                  <FontAwesomeIcon
                    fontSize={14}
                    icon={GOALS_STATUSES_ICONS[store.goal.status]}
                    fixedWidth
                  />
                  <chakra.span
                    color='gray.500'
                    fontSize='sm'
                    fontWeight='normal'
                    ml={1}
                  >
                    {GOALS_STATUSES_TITLES[store.goal.status]}
                  </chakra.span>
                </Button>
              </Tooltip>
            </div>
          )}
        />
      </div>
    );
  }
);
