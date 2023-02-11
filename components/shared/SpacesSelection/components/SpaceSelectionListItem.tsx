import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  chakra,
  Checkbox,
  ListItem,
  forwardRef,
} from '@chakra-ui/react';
import { useSpacesSelectionStore } from '../store';
import { SpaceData } from '../../../pages/Spaces/types';
import { SpacesSmallIcon } from '../../../pages/Spaces/components/SpacesIcons/SpacesSmallIcon';

type SpaceSelectionListItemProps = {
  space: SpaceData;
  index: number | null;
  checkboxContent?: React.ReactNode;
};

export const SpaceSelectionListItem = observer(
  forwardRef(function SpaceSelectionListItem(
    { space, index, checkboxContent }: SpaceSelectionListItemProps,
    ref
  ) {
    const store = useSpacesSelectionStore();
    const { id, name } = space

    return (
      <ListItem
        h={10}
        display='flex'
        alignItems='center'
        borderBottom='1px'
        borderColor='gray.100'
        key={id}
      >
        <Checkbox
          ref={ref}
          isChecked={!!store.checkedSpace[id]}
          onChange={() => store.handleSpaceCheck(index)}
          size='xl'
          position='relative'
          fontWeight='semibold'
          fontSize='lg'
          width='100%'
          icon={checkboxContent ? <></> : undefined}
          css={{
            '.chakra-checkbox__label': {
              width: 'calc(100% - 2rem)',
            }
          }}
        >
          {checkboxContent ? (
            <chakra.span
              position='absolute'
              left={0}
              w={6}
              top={0}
              bottom={0}
              display='flex'
              alignItems='center'
              justifyContent='center'
              color={store.checkedSpace[id] ? 'white' : 'gray.400'}
            >
              {checkboxContent}
            </chakra.span>
          ) : null}
          <chakra.span
            display='flex'
            alignItems='center'
            fontSize='sm'
            fontWeight='normal'
          >
            <chakra.div
              pt={1}
              pb={1}
              w='100%'
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <chakra.span display='flex' alignItems='center'>
                <SpacesSmallIcon space={space} size={6} borderRadius={4} bgOpacity='.100' />
                <chakra.span ml={3} mr={3} overflow='hidden' textOverflow='ellipsis'>
                  {name}
                </chakra.span>
              </chakra.span>
            </chakra.div>
          </chakra.span>
        </Checkbox>
      </ListItem>
    );
  })
);
