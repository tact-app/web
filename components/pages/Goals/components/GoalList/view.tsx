import { observer } from 'mobx-react-lite';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { faList } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SpaceItem } from './SpaceItem';
import { Filters } from "../../../../shared/Filters";
import { ManArrowToIcon } from "../../../../images/icons/ManArrowToIcon";
import { ManArrowOffIcon } from "../../../../images/icons/ManArrowOffIcon";
import { useGoalListStore } from "./store";
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';

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
];

export const GoalListView = observer(function GoalListView() {
  const store = useGoalListStore();

  useHotkeysHandler(
    store.keyMap,
    store.hotkeyHandlers,
    { enabled: !store.isHotkeysDisabled && !store.root.globalModals.isOpen }
  );

  return (
    <Box p={0} ref={store.setContainerRef}>
      {store.root.resources.goals.haveGoals && <Filters options={GOALS_LIST_FILTERS} value='all' />}
      <Flex flexDirection='column' mb={2} mt={8}>
        {Object.entries(store.listBySpaces).map(([spaceId, goals]) => (
          <SpaceItem key={spaceId} spaceId={spaceId} goals={goals} />
        ))}
      </Flex>
    </Box>
  );
});
