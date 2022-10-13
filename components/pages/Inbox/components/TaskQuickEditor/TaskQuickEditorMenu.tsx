import { observer } from 'mobx-react-lite';
import { useTaskQuickEditorStore } from './store';
import { chakra, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { DotsIcon } from '../../../../shared/Icons/DotsIcon';
import React from 'react';


export const TaskQuickEditorMenu = observer(function TaskQuickEditMenu() {
  const store = useTaskQuickEditorStore();

  return (
    <chakra.div visibility={store.focused ? 'visible' : 'hidden'}>
      <Menu isOpen={store.isMenuOpen} onClose={store.closeMenu} onOpen={store.openMenu}>
        <MenuButton as={IconButton} aria-label='Task options' variant='outline' borderColor='white' h={6} w={6}
                    minW={6} p={1}>
          <DotsIcon/>
        </MenuButton>
        <MenuList p={0} shadow='lg'>
          <MenuItem fontSize='sm' lineHeight='5' fontWeight='normal' command='!' onClick={store.startPriority}>
            Set priority
          </MenuItem>
          <MenuItem fontSize='sm' lineHeight='5' fontWeight='normal' command='#' onClick={store.startTag}>
            Add tag
          </MenuItem>
        </MenuList>
      </Menu>
    </chakra.div>
  )
})
