import { observer } from 'mobx-react-lite';
import { useTaskQuickEditorStore } from './store';
import {
  chakra,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Portal,
  MenuList,
} from '@chakra-ui/react';
import {
  faBullseyePointer,
  faCircleExclamation,
  faHashtag,
  faSolarSystem,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        <Portal>
          <MenuList p={0} shadow='lg' zIndex='modal'>
            <MenuItem
                lineHeight='5'
                fontWeight='normal'
                command='#'
                p={2.5}
                icon={
                  <FontAwesomeIcon icon={faHashtag} fixedWidth />
                }
                onClick={() => {
                  store.input.focus();
                  store.modals.openAddTagModal();
                }}
            >
              Add hashtag
            </MenuItem>
            <MenuItem
                lineHeight='5'
                fontWeight='normal'
                command='!'
                p={2.5}
                icon={
                  <FontAwesomeIcon icon={faCircleExclamation} fixedWidth />
                }
                onClick={() => {
                  store.input.focus();
                  store.modals.openPriorityModal();
                }}
            >
              Set priority
            </MenuItem>
            {!store.disableGoalChange && (
              <MenuItem
                lineHeight='5'
                fontWeight='normal'
                command='*'
                p={2.5}
                icon={
                  <FontAwesomeIcon icon={faBullseyePointer} fixedWidth />
                }
                onClick={() => {
                  store.input.focus();
                  store.modals.openGoalAssignModal();
                }}
              >
                {store.modes.goal.selectedGoalId ? 'Change goal' : 'Set goal'}
              </MenuItem>
            )}
            {!store.disableSpaceChange && (
              <MenuItem
                lineHeight='5'
                fontWeight='normal'
                command='^'
                p={2.5}
                icon={
                  <FontAwesomeIcon icon={faSolarSystem} fixedWidth />
                }
                onClick={(e) => {
                  store.input.focus();
                  store.modals.openSpaceChangeModal();
                }}
              >
                Change space
              </MenuItem>
            )}
          </MenuList>
        </Portal>
      </Menu>
    </chakra.div>
  );
});
