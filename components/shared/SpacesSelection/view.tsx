import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  List,
  chakra,
  ListItem,
  Checkbox
} from '@chakra-ui/react';
import { SpacesSelectionProps, useSpacesSelectionStore } from './store';
import { SpaceSelectionListItem } from './components/SpaceSelectionListItem'
import { HeavyPlusIcon } from '../Icons/HeavyPlusIcon';
import { SpaceData } from '../../pages/Spaces/types';

export const SpaceSelectionView = observer(function SpaceSelectionView(
  props: Partial<SpacesSelectionProps>
) {
  const store = useSpacesSelectionStore();
  const ref = useRef();
  const spaceList: SpaceData[] = store.filteredSpaces
  return (
    <List ref={ref} h='100%' overflowY='auto' pl={1} pr={1}>
      {spaceList?.map((space, index) => (
        <SpaceSelectionListItem
          ref={(el) => props.setRefs(index + 1, el)}
          key={space.id}
          index={index}
          space={space}
          checkboxContent={index < 9 ? index + 1 : null}
        />
      ))}
      {spaceList?.length < 9 &&
        <ListItem
          h={10}
          display='flex'
          alignItems='center'
          borderBottom='1px'
          borderColor='gray.100'
          key={'add-space'}
          cursor='pointer'
          onClick={store.callbacks.onSpaceCreateClick}
        >
          <Checkbox
            ref={(el) => props.setRefs(spaceList.length + 1, el)}
            isChecked={false}
            size='xl'
            position='relative'
            width='100%'
            icon={
              <chakra.div
                display='flex'
                justifyContent='center'
                alignItems='center'
              >
                <HeavyPlusIcon />
              </chakra.div>}
            css={{
              '.chakra-checkbox__label': {
                width: 'calc(100% - 2rem)',
              },
              '.chakra-checkbox__control': {
                borderRadius: '100%',
              }
            }}
          >
            <chakra.span
              fontSize='sm'
              fontWeight='normal'
              lineHeight={5}>
              Add new space
            </chakra.span>
          </Checkbox>
        </ListItem>
      }
    </List>
  )
});
