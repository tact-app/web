import { Avatar, Center } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useUser } from '@auth0/nextjs-auth0/client';

const UserMenu = observer(function UserNavbar() {
  const { user } = useUser();

  return (
    <Center>
      <Avatar size='sm' src={user?.picture} />
    </Center>
  );
});

export default UserMenu;
