import { Box, Divider, HStack, Text, useOutsideClick } from '@chakra-ui/react';
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
    <Box boxShadow='lg' w={56} borderRadius='lg' overflow='hidden'>
      <Box maxH={72} overflow='auto'>
        {store.items
          .filter(({ options }) => options.length)
          .map(({ options, name }) => (
            <>
              {options.map(({ icon, label }, index) => {
                const isMatch = store.getLocalIndexMatch(name, index);
                return (
                  <Box
                    key={label}
                    fontSize='sm'
                    lineHeight='5'
                    fontWeight='normal'
                    p={2}
                    bg={isMatch ? 'gray.100' : 'white'}
                    ref={
                      isMatch
                        ? (el) => {
                            if (el) {
                              el.scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest',
                              });
                            }
                          }
                        : null
                    }
                    onClick={() => store.selectItem(index)}
                    cursor='pointer'
                  >
                    <HStack w='100%'>
                      {icon()}
                      <Text>{label}</Text>
                    </HStack>
                  </Box>
                );
              })}
              <Divider />
            </>
          ))}
      </Box>
    </Box>
  );
});
