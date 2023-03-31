import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  chakra,
} from '@chakra-ui/react';
import React, { PropsWithChildren, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Modes, useTaskQuickEditorStore } from './store';

export const SUGGESTIONS_MENU_ID = 'task-quick-editor-suggestions';

export const TaskQuickEditorMenu = observer(function TaskQuickEditorMenu({
  items,
  openForMode,
  children,
}: PropsWithChildren<{
  items: React.ReactNode[];
  openForMode?: Modes;
}>) {
  const store = useTaskQuickEditorStore();
  const isOpen = !store.disabledModes.includes(store.activeModeType) && (
    openForMode
      ? store.suggestionsMenu.openForMode === openForMode
      : store.suggestionsMenu.isOpen
  );

  useEffect(() => {
    if (isOpen && items.length && items.length !== store.suggestionsMenu.itemsCount) {
      store.suggestionsMenu.setCount(items.length);
    }
  }, [isOpen, items.length, store.suggestionsMenu, store.suggestionsMenu.itemsCount]);

  if (!items.length) {
    return null;
  }

  return (
    <Popover
      isOpen={isOpen}
      placement={'bottom-start'}
      offset={[0, openForMode ? 24 : 8]}
      isLazy
      autoFocus={false}
    >
      <PopoverTrigger>{children ? children : <chakra.span />}</PopoverTrigger>
      <Portal>
        <PopoverContent
          data-id={SUGGESTIONS_MENU_ID}
          onClick={(e) => e.stopPropagation()}
          p={0}
          boxShadow='lg'
          onFocus={store.handleFocusMenu}
          minW={32}
          maxW={72}
          width='auto'
          overflow='hidden'
        >
          <PopoverBody p={0} maxH={64} overflow='auto'>
            {items.map((child, index) => (
              <Button
                variant='ghost'
                size='sm'
                borderRadius={0}
                w='100%'
                key={index}
                height='auto'
                minH={8}
                fontSize='sm'
                fontWeight='normal'
                display='flex'
                justifyContent='start'
                onClick={(e) => store.suggestionsMenu.onSelect(index)}
                bg={
                  store.suggestionsMenu.hoveredIndex === index
                    ? 'gray.100'
                    : 'white'
                }
                ref={
                  store.suggestionsMenu.hoveredIndex === index
                    ? (el) => store.suggestionsMenu.setRef(el)
                    : undefined
                }
                _focus={{
                  outline: 'none',
                  boxShadow: 'none',
                }}
              >
                {child}
              </Button>
            ))}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
});
