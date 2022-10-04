import Head from 'next/head';
import {
  Box,
  Flex,
  useColorModeValue,
  Divider
} from '@chakra-ui/react';
import {
  EmailIcon, CalendarIcon, CheckIcon
} from '@chakra-ui/icons';
import { NavItem } from './components/MainMenu/types';
import { MainMenu } from './components/MainMenu';
import UserMenu from './components/UserNavbar';
import { routes } from '../../routes/constants';
import { ReactNode } from 'react';

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Inbox',
    icon: <EmailIcon/>,
    href: routes.INBOX,
  },
  {
    label: 'Today',
    icon: <CheckIcon/>,
    href: routes.TODAY,
  },
  {
    label: 'Calendar',
    icon: <CalendarIcon/>,
    href: routes.CALENDAR,
  },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Flex direction='row' h='100vh'>
      <Head>
        <title>Tact</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width'/>
      </Head>
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
          <UserMenu/>
        </Box>
        <Divider borderColor={useColorModeValue('gray.100', 'gray.800')}/>
        <MainMenu items={NAV_ITEMS}/>
      </Flex>
      <Box p={4} flex='1'>{children}</Box>
    </Flex>
  );
}



