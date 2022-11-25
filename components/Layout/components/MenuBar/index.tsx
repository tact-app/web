import { observer } from 'mobx-react-lite';
import { Box, Divider, Flex, useColorModeValue } from '@chakra-ui/react';
import UserMenu from '../UserMenu';
import { MainMenu } from '../MainMenu';
import { NavItem } from '../MainMenu/types';
import { routes } from '../../../../routes/constants';
import { useRootStore } from '../../../../stores/RootStore';
import {
  faBullseyePointer,
  faCalendarWeek,
  faMailboxFlagUp,
} from '@fortawesome/pro-light-svg-icons';
import { isMac } from '../../../../helpers/os';

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Today',
    icon: faCalendarWeek,
    hotkey: () => (isMac() ? '⌥⇧T' : 'Alt+Shift+T'),
    href: routes.TODAY,
  },
  {
    label: 'Inbox',
    icon: faMailboxFlagUp,
    hotkey: () => (isMac() ? '⌥⇧I' : 'Alt+Shift+I'),
    href: routes.INBOX,
  },
  {
    label: 'Goals',
    icon: faBullseyePointer,
    hotkey: () => (isMac() ? '⌥⇧G' : 'Alt+Shift+G'),
    href: routes.GOALS,
  },
];

export const MenuBarView = observer(function MenuBarView() {
  return (
    <Box
      borderRight='1px'
      borderColor={useColorModeValue('gray.200', 'gray.900')}
      bg='gray.100'
    >
      <Flex
        direction='column'
        color={useColorModeValue('gray.600', 'white')}
        p={2}
        pt={6}
        w={14}
      >
        <UserMenu />
        <Divider borderColor='gray.300' mt={4} mb={4} />
        <MainMenu items={NAV_ITEMS} />
      </Flex>
    </Box>
  );
});

export const MenuBar = observer(function MenuBar() {
  const store = useRootStore();

  return store.menu.replacer ? store.menu.replacer : <MenuBarView />;
});
