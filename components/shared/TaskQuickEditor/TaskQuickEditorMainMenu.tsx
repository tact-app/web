import { observer } from 'mobx-react-lite';
import { Modes, useTaskQuickEditorStore } from './store';
import {
  chakra,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { DotsIcon } from '../Icons/DotsIcon';
import React from 'react';

export const TaskQuickEditorMainMenu = observer(function TaskQuickEditMenu() {
  const store = useTaskQuickEditorStore();

  return (
    <chakra.div visibility={store.isInputFocused ? 'visible' : 'hidden'}>
      <Menu
        isOpen={store.isMenuOpen}
        onClose={store.closeMenu}
        onOpen={store.openMenu}
      >
        <MenuButton
          as={IconButton}
          onKeyDown={store.handleKeyDownMainMenu}
          aria-label='Task options'
          variant='outline'
          borderColor='white'
          h={6}
          w={6}
          minW={6}
          p={1}
        >
          <DotsIcon />
        </MenuButton>
        <MenuList p={0} shadow='lg'>
          <MenuItem
            fontSize='sm'
            lineHeight='5'
            fontWeight='normal'
            command='#'
            onClick={() => store.activateMode(Modes.TAG)}
          >
            Add tag
          </MenuItem>
          <MenuItem
            fontSize='sm'
            lineHeight='5'
            fontWeight='normal'
            command='!'
            onClick={() => store.activateMode(Modes.PRIORITY)}
          >
            Set priority
          </MenuItem>
          <MenuItem
            fontSize='sm'
            lineHeight='5'
            fontWeight='normal'
            command='*'
            onClick={() => store.activateMode(Modes.GOAL)}
          >
            Add goal
          </MenuItem>
          <MenuItem
            fontSize='sm'
            lineHeight='5'
            fontWeight='normal'
            command='^'
            onClick={() => store.activateMode(Modes.SPACE)}
          >
            Link to space
          </MenuItem>
        </MenuList>
      </Menu>
    </chakra.div>
  );
});
