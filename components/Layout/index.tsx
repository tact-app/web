import Head from 'next/head';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Collapse,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import { NavItem } from './components/Navbar/types';
import { DesktopNavbar } from './components/Navbar/DesktopNavbar';
import { MobileNavbar } from './components/Navbar/MobileNavbar';
import UserNavbar from './components/UserNavbar';
import { routes } from '../../routes/constants';
import { ReactNode } from 'react';

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Tasks',
    href: routes.TASKS,
  },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Head>
        <title>Tact</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width'/>
      </Head>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3}/> : <HamburgerIcon w={5} h={5}/>
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}>
            Logo
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNavbar items={NAV_ITEMS}/>
          </Flex>
        </Flex>

        <UserNavbar/>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNavbar items={NAV_ITEMS} onItemClick={onToggle}/>
      </Collapse>

      <Box p={4}>{children}</Box>
    </Box>
  );
}



