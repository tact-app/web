import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Spinner,
  useColorMode
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../../../stores/RootStore';

const UserNavbar = observer(function UserNavbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const store = useRootStore();

  if (store.isLoading) {
    return <Spinner/>;
  }

  if (!store.user.isAuth) {
    return (
      <Stack
        flex={{ base: 1, md: 0 }}
        justify={'flex-end'}
        direction={'row'}
        spacing={6}>
        <Button onClick={toggleColorMode} variant='ghost'>
          {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
        </Button>
        <Button
          onClick={() => store.user.login()}
          as={'a'}
          fontSize={'sm'}
          fontWeight={400}
          variant={'link'}
          href={'#'}>
          Sign In
        </Button>
        <Button
          display={{ base: 'none', md: 'inline-flex' }}
          fontSize={'sm'}
          fontWeight={600}
          color={'white'}
          bg={'pink.400'}
          _hover={{
            bg: 'pink.300',
          }}>
          Sign Up
        </Button>
      </Stack>
    );
  } else {
    return (
      <Stack
        flex={{ base: 1, md: 0 }}
        justify={'flex-end'}
        direction={'row'}
        spacing={6}
      >
        <Button onClick={toggleColorMode} variant='ghost'>
          {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
        </Button>
        <Menu>
          <MenuButton
            as={Button}
            rounded={'full'}
            variant={'link'}
            cursor={'pointer'}
            minW={0}>
            <Avatar
              size={'sm'}
              src={
                'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
              }
            />
          </MenuButton>
          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Help</MenuItem>
            <MenuDivider/>
            <MenuItem onClick={store.user.logout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Stack>
    );
  }
});

export default UserNavbar;