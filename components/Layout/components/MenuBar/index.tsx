import { observer } from 'mobx-react-lite';
import { Divider, Flex, useColorModeValue } from '@chakra-ui/react';
import UserMenu from '../UserMenu';
import { MainMenu } from '../MainMenu';
import { NavItem } from '../MainMenu/types';
import { routes } from '../../../../routes/constants';
import { useRootStore } from '../../../../stores/RootStore';
import {
  faBullseyeArrow,
  faCalendarDay,
  faInboxes,
} from '@fortawesome/pro-regular-svg-icons';

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Today',
    icon: faCalendarDay,
    hotkey: 'Ctrl+Shift+T',
    href: routes.TODAY,
  },
  {
    label: 'Inbox',
    icon: faInboxes,
    hotkey: 'Ctrl+Shift+I',
    href: routes.INBOX,
  },
  {
    label: 'Goals',
    icon: faBullseyeArrow,
    hotkey: 'Ctrl+Shift+G',
    href: routes.GOALS,
  },
];

export const MenuBarView = observer(function MenuBarView() {
  return (
    <Flex
      direction='column'
      color={useColorModeValue('gray.600', 'white')}
      borderRight='1px'
      borderColor={useColorModeValue('gray.200', 'gray.900')}
      p={1}
      pt={6}
      w={14}
      bg='gray.100'
    >
      <UserMenu />
      <Divider borderColor='gray.300' mt={5} mb={3} />
      <MainMenu items={NAV_ITEMS} />
    </Flex>
  );
});

export const MenuBar = observer(function MenuBar() {
  const store = useRootStore();

  return store.menu.replacer ? store.menu.replacer : <MenuBarView />;
});
