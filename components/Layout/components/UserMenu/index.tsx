import { Avatar, Spinner, useColorMode } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../../../stores/RootStore';

const UserMenu = observer(function UserNavbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const store = useRootStore();

  if (store.isLoading) {
    return <Spinner />;
  }

  return (
    <Avatar
      ml={2}
      mr={2}
      size='sm'
      src={
        'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
      }
    />
  );
});

export default UserMenu;
