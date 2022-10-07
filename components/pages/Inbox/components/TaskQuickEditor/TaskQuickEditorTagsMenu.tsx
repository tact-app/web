import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTaskQuickEditorStore } from './store';

export const TaskQuickEditorTagsMenu = observer(function TaskQuickEditorTagsMenu() {
  const store = useTaskQuickEditorStore();

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