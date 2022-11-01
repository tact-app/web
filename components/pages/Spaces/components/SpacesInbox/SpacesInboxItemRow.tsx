import { observer } from 'mobx-react-lite';
import { Box, chakra, Text } from '@chakra-ui/react';
import { SpacesInboxItemData, SpacesInboxItemStatusTypes } from './types';
import { useSpacesInboxStore } from './store';
import { TaskItemMenu } from '../../../../shared/TasksList/components/TaskItemMenu';
import React, { useCallback } from 'react';

export const SpacesInboxItemRow = observer(function SpacesInboxItemRow({
  item,
}: {
  item: SpacesInboxItemData;
}) {
  const store = useSpacesInboxStore();
  const isToDoItem = item.status !== SpacesInboxItemStatusTypes.COMPLETED;
  const bg = 'white';
  const hoveredBg = 'gray.100';
  const focusedBg = 'gray.200';
  const isFocused = store.focusedItemId === item.id;

  const handleClick = useCallback(
    () => store.handleItemClick(item.id),
    [store, item]
  );

  return (
    <Box
      flex={1}
      display='flex'
      transition={['filter 0.2s ease-in-out', 'opacity 0.2s ease-in-out']}
      cursor='pointer'
    >
      <Box
        flex={1}
        borderBottom='1px'
        borderColor='gray.100'
        transition={[
          'border-color 0.2s ease-in-out',
          'background 0.2s ease-in-out',
        ]}
        onClick={handleClick}
        bg={isFocused ? focusedBg : bg}
        _groupHover={{
          bg: isFocused ? focusedBg : hoveredBg,
          borderColor: 'gray.100',
        }}
      >
        <Box h={10} pl={2} display='flex' alignItems='center'>
          <Box position='relative'>
            <Text
              transition='color 0.2s ease-in-out'
              color={isToDoItem ? 'gray.700' : 'gray.400'}
            >
              {item.title}
            </Text>
            <chakra.div
              h='1px'
              bg='gray.400'
              bottom='0.675rem'
              transition='width 0.2s ease-in-out'
              position='absolute'
              w={isToDoItem ? 0 : '100%'}
            />
          </Box>
        </Box>
      </Box>
      <TaskItemMenu />
    </Box>
  );
});
