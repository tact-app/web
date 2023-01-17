import { observer } from 'mobx-react-lite';
import { SpacesInboxProps, useSpacesInboxStore } from './store';
import {
  Box,
  Container,
  IconButton,
  chakra,
} from '@chakra-ui/react';
import { SpacesInboxItemRow } from './SpacesInboxItemRow';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/pro-regular-svg-icons';
import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { SpacesInboxBreadcrumbs } from './SpacesInboxBreadcrumbs';
import { Search } from '../../../../shared/Search';

export const SpacesInboxView = observer(function SpacesInboxView(
  props: SpacesInboxProps
) {
  const store = useSpacesInboxStore();
  const parentRef = React.useRef<HTMLDivElement | null>(null);

  const rows = useVirtualizer({
    count: store.filteredItems.length,
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
      </Box>
      <Search onChange={store.updateSearch} />
      <Box overflow='auto' ref={parentRef} flex={1}>
        <chakra.div
          style={{
            height: rows.getTotalSize(),
            width: '100%',
            position: 'relative',
          }}
        >
          {!store.filteredItems.length && (
              <chakra.div w={'100%'} textAlign='center' m={2}>
                <chakra.span
                    fontSize='sm'
                    fontWeight='normal'
                    color='gray.400'
                    pr={1}
                    pl={1}
                >
                  No result found
                </chakra.span>
              </chakra.div>
          )}
          {rows.getVirtualItems().map((virtualRow) => (
            <Box
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={
                store.filteredItems[virtualRow.index].id === store.focusedItemId
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
              <SpacesInboxItemRow item={store.filteredItems[virtualRow.index]} />
            </Box>
          ))}
        </chakra.div>
      </Box>
    </Container>
  );
});
