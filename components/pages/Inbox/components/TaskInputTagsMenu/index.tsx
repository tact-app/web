import { chakra, Menu, MenuButton, MenuItem, MenuList, useMenu } from '@chakra-ui/react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTaskInputStore } from '../TaskInput/store';

export const TaskInputTagsMenu = observer(function TaskInputTagsMenu() {
  const store = useTaskInputStore();

  return (
    <Menu isOpen={store.tagsMenuOpen} placement='bottom-start' offset={[0, 24]}>
      <MenuButton visibility='hidden'/>
      <MenuList p={0} boxShadow='lg' onFocus={() => store.input.focus()}>
        {store.currentTagValue.length > 1 && !store.currentTagMatch && (
          <MenuItem
            fontSize='sm'
            lineHeight='5'
            fontWeight='normal'
            onClick={store.createNewTag}
          >
            Tag not found. Create new "{store.currentTagValue.slice(1)}"
          </MenuItem>
        )}
        {store.filteredAvailableTags.map(({ title, id }) => (
          <MenuItem
            key={id}
            fontSize='sm'
            lineHeight='5'
            fontWeight='normal'
            onClick={() => store.addAvailableTag(id)}
          >
            {title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
});