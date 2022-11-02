import {
  Box,
  HStack,
  Popover,
  PopoverContent,
  Text,
  useOutsideClick,
} from '@chakra-ui/react';
import React, { PropsWithChildren, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useEditorCreateMenuStore } from './store';

export const EditorCreateMenuView = observer(function EditorCreateMenu({
  children,
}: PropsWithChildren) {
  const store = useEditorCreateMenuStore();
  const ref = useRef(null);

  useOutsideClick({
    ref: ref,
    handler: store.handleClose,
  });

  return (
    <Popover isLazy isOpen={true} autoFocus={false}>
      <PopoverContent boxShadow='lg' overflow='hidden' w={56} ref={ref}>
        {store.items.map(({ icon: Icon, label }, index) => (
          <Box
            key={label}
            fontSize='sm'
            lineHeight='5'
            fontWeight='normal'
            p={2}
            bg={store.selectedIndex === index ? 'gray.100' : 'white'}
            onClick={() => store.selectItem(index)}
            cursor='pointer'
          >
            <HStack w='100%'>
              <Icon />
              <Text>{label}</Text>
            </HStack>
          </Box>
        ))}
      </PopoverContent>
    </Popover>
  );
});
