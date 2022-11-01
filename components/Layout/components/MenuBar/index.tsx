import { observer } from 'mobx-react-lite';
import { Divider, Flex, useColorModeValue } from '@chakra-ui/react';
import UserMenu from '../UserMenu';
import { MainMenu } from '../MainMenu';
import { NavItem } from '../MainMenu/types';
import { routes } from '../../../../routes/constants';
import { useRootStore } from '../../../../stores/RootStore';
import { MailIcon } from '../../../shared/Icons/MailIcon';
import { GoalsIcon } from '../../../shared/Icons/GoalsIcon';
import { CalendarIcon } from '../../../shared/Icons/CalendarIcon';

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Tasks',
    icon: <CalendarIcon />,
    href: routes.TASKS,
  },
  {
    label: 'Spaces',
    icon: <MailIcon />,
    href: routes.SPACES,
  },
  {
    label: 'Goals',
    icon: <GoalsIcon />,
    href: routes.GOALS,
  },
];

export const MenuBarView = observer(function MenuBarView() {
  return (
    <Flex
      direction='column'
      color={useColorModeValue('gray.600', 'white')}
      borderRight='1px'
      borderColor={useColorModeValue('gray.100', 'gray.900')}
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
