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
  useColorMode, Text, Flex
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../../../stores/RootStore';

const UserMenu = observer(function UserNavbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const store = useRootStore();

  if (store.isLoading) {
    return <Spinner/>;
  }

  return (
    <Stack direction='row'>
      <Avatar
        size={'md'}
        src={
          'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
        }
      />
      <Flex direction='column' justifyContent='center'>
        <Text fontSize='xl' lineHeight={7} fontWeight={700}>{store.user.data.name}</Text>
        <Text fontSize='xs' lineHeight={4} fontWeight={400} marginTop={0}>{store.user.data.email}</Text>
      </Flex>
    </Stack>
  );
});

export default UserMenu;