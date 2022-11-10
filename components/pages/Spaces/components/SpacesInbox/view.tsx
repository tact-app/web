import { observer } from 'mobx-react-lite';
import { SpacesInboxProps, useSpacesInboxStore } from './store';
import {
  Box,
  Container,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  chakra,
} from '@chakra-ui/react';
import { SpacesInboxItemRow } from './SpacesInboxItemRow';
import { SearchIcon } from '../../../../shared/Icons/SearchIcon';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/pro-regular-svg-icons';
import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { SpacesInboxBreadcrumbs } from './SpacesInboxBreadcrumbs';

export const SpacesInboxView = observer(function SpacesInboxView(
  props: SpacesInboxProps
) {
  const store = useSpacesInboxStore();
  const parentRef = React.useRef<HTMLDivElement | null>(null);

  const rows = useVirtualizer({
    count: store.items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 41,
  });

  useHotkeysHandler(store.keyMap, store.hotkeysHandlers, {
    enabled: props.isHotkeysEnabled,
  });

  return (
    <Container
      flex={1}
      maxW='container.lg'
      pt={10}
      h='100%'
      display='flex'
      flexDirection='column'
      overflow='hidden'
      onMouseDown={store.callbacks.onFocus}
    >
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={7}
      >
        <SpacesInboxBreadcrumbs />
        <Box>
          <IconButton
            aria-label='today help'
            size='xs'
            variant='ghost'
            onClick={props.callbacks.onTodayHelpClick}
          >
            <FontAwesomeIcon
              icon={faListCheck}
              fixedWidth
              size='lg'
              color='var(--chakra-colors-gray-400)'
            />
          </IconButton>
        </Box>
      </Box>
      <InputGroup size='md' mb={6}>
        <Input placeholder='Search...' borderWidth='2px' />
        <InputRightElement>
          <SearchIcon />
        </InputRightElement>
      </InputGroup>
      <Box overflow='auto' ref={parentRef} flex={1}>
        <chakra.div
          style={{
            height: rows.getTotalSize(),
            width: '100%',
            position: 'relative',
          }}
        >
          {rows.getVirtualItems().map((virtualRow) => (
            <Box
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={
                store.items[virtualRow.index].id === store.focusedItemId
                  ? store.setFocusedItemRef
                  : null
              }
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <SpacesInboxItemRow item={store.items[virtualRow.index]} />
            </Box>
          ))}
        </chakra.div>
      </Box>
    </Container>
  );
});
