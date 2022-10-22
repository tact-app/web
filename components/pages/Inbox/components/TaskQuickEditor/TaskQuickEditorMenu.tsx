import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  chakra,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTaskQuickEditorStore } from './store';

export const TaskQuickEditorMenu = observer(function TaskQuickEditorMenu({
  items,
}: {
  items: React.ReactNode[];
}) {
  const store = useTaskQuickEditorStore();

  useEffect(() => {
    if (
      store.suggestionsMenu.isOpen &&
      items.length !== store.suggestionsMenu.itemsCount
    ) {
      store.suggestionsMenu.setCount(items.length);
    }
  }, [
    items.length,
    store.suggestionsMenu,
    store.suggestionsMenu.isOpen,
    store.suggestionsMenu.itemsCount,
  ]);

  return (
    <Popover
      isOpen={store.suggestionsMenu.isOpen}
      placement='bottom-start'
      offset={[0, 24]}
      isLazy
      autoFocus={false}
    >
      <PopoverTrigger>
        <chakra.span />
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          onClick={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          p={0}
          boxShadow='lg'
          onFocus={store.handleFocus}
          minW={32}
          width='auto'
          overflow='hidden'
        >
          <PopoverBody p={0}>
            {items.map((child, index) => (
              <Button
                variant='ghost'
                size='sm'
                borderRadius={0}
                w='100%'
                key={index}
                fontSize='sm'
                lineHeight='5'
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
