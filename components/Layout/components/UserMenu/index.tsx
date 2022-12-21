import { Avatar, Center, useColorMode } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../../../stores/RootStore';

const UserMenu = observer(function UserNavbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const store = useRootStore();

  return (
    <Center>
      <Avatar size='sm' src={store.user.data?.avatar} />
    </Center>
  );
});

export default UserMenu;
