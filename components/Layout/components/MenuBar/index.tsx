import { observer } from 'mobx-react-lite';
import { Box, Divider, Flex, useColorModeValue } from '@chakra-ui/react';
import UserMenu from '../UserMenu';
import { MainMenu } from '../MainMenu';
import { NavItem } from '../MainMenu/types';
import { CalendarIcon, CheckIcon, EmailIcon } from '@chakra-ui/icons';
import { routes } from '../../../../routes/constants';
import { useRootStore } from '../../../../stores/RootStore';

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Inbox',
    icon: <EmailIcon />,
    href: routes.INBOX,
  },
  {
    label: 'Goals',
    icon: <CheckIcon />,
    href: routes.GOALS,
  },
  {
    label: 'Calendar',
    icon: <CalendarIcon />,
    href: routes.CALENDAR,
  },
];

export const MenuBarView = observer(function MenuBarView() {
  return (
    <Flex
      direction='column'
      bg={useColorModeValue('white', 'gray.800')}
      color={useColorModeValue('gray.600', 'white')}
      borderRight='1px'
      borderColor={useColorModeValue('gray.100', 'gray.900')}
      p={4}
      w={72}
    >
      <Box p={2} pl={4} pr={4} mb={4}>
        <UserMenu />
      </Box>
      <Divider borderColor={useColorModeValue('gray.100', 'gray.800')} />
      <MainMenu items={NAV_ITEMS} />
    </Flex>
  );
});

export const MenuBar = observer(function MenuBar() {
  const store = useRootStore();

  return store.menu.replacer ? store.menu.replacer : <MenuBarView />;
});
