import { observer } from 'mobx-react-lite';
import { Box, Text } from '@chakra-ui/react';
import { useSpacesInboxStore } from './store';
import React, { useCallback } from 'react';
import { SpacesInboxItemData } from '../../types';
import { OriginIcon } from '../SpacesIcons/OriginsIcons';

export const SpacesInboxItemRow = observer(function SpacesInboxItemRow({
  item,
}: {
  item: SpacesInboxItemData;
}) {
  const store = useSpacesInboxStore();
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
        w='100%'
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
          <Box w={4} h={4} mr={1}>
            <OriginIcon origin={item.origin.type} />
          </Box>
          <Box position='relative' overflow='hidden'>
            <Text
              transition='color 0.2s ease-in-out'
              color={'gray.700'}
              whiteSpace='nowrap'
              textOverflow='ellipsis'
              overflow='hidden'
            >
              {item.title}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});
