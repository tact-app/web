import { Avatar, Spinner, useColorMode } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../../../stores/RootStore';

const UserMenu = observer(function UserNavbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const store = useRootStore();

  if (store.isLoading) {
    return <Spinner />;
  }

  return <Avatar ml={2} mr={2} size='sm' src={store.user.data.avatar} />;
});

export default UserMenu;
