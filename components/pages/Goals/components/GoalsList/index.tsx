import { observer } from 'mobx-react-lite';
import { Box, Heading, Flex } from '@chakra-ui/react';
import { useGoalsStore } from '../../store';
import { GoalCreateNewButton } from '../GoalCreateNewButton';
import React from 'react';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import { faList } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SpaceItem } from '../SpaceItem';
import { EmptyGoalListMessage } from '../EmptyGoalListMessage/EmptyGoalListMessage';
import { Filters } from "../../../../shared/Filters";
import { ManArrowToIcon } from "../../../../images/icons/ManArrowToIcon";
import { ManArrowOffIcon } from "../../../../images/icons/ManArrowOffIcon";

const GOALS_LIST_FILTERS = [
  {
    value: 'all',
    label: 'All',
    icon: <FontAwesomeIcon icon={faList} fontSize={18} />
  },
  {
    value: 'created-by-me',
    label: 'Created by me',
    icon: <ManArrowOffIcon width={24} />
  },
  {
    value: 'assigned-to-me',
    label: 'Assigned to me',
    icon: <ManArrowToIcon width={24} />
  },
]

export const GoalsList = observer(function GoalsList() {
  const store = useGoalsStore();

  useHotkeysHandler(store.keymap, store.hotkeysHandlers, {
    enabled: !store.modals.isOpen,
    keyup: true,
  });

  const haveGoals = store.root.resources.goals.haveGoals;

  return (
    <Box pl={32} pr={32}>
      <Heading
        size='md'
        fontSize='2xl'
        mt={0}
        mb={0}
        pt={4}
        pb={10}
        textAlign={haveGoals ? 'left' : 'center'}
      >
        Goals
      </Heading>

      {haveGoals && <Filters options={GOALS_LIST_FILTERS} value='all' />}

      <Flex flexDirection='column' mb={2} mt={8}>
        {haveGoals
          ? Object.entries(store.extendedGoals).map(([spaceId, goals]) => (
              <SpaceItem key={spaceId} spaceId={spaceId} goals={goals} />
            ))
          : <EmptyGoalListMessage />}
      </Flex>

      {haveGoals && (
        <GoalCreateNewButton
          withHotkey
          withTooltip
          borderRadius='full'
          w={12}
          h={12}
          position='absolute'
          bottom={6}
          right={6}
          mb={0}
        >
          <FontAwesomeIcon icon={faPlus} fontSize={18} />
        </GoalCreateNewButton>
      )}
    </Box>
  );
});
