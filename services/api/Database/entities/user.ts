import { UserData } from '../../../../stores/RootStore/UserStore';

const user: UserData = {
  id: '1',
  name: 'John Doe',
  email: 'test@test.ts',
  avatar: 'https://i.pravatar.cc/150?img=67',
  accounts: [
    {
      id: '1',
      name: 'John Doe',
      email: 'JD@gmail.com',
      avatar: 'https://i.pravatar.cc/150?img=50',
    },
    {
      id: '2',
      name: 'Elvis Presley',
      email: 'elvis_presley@gmail.com',
      avatar: 'https://i.pravatar.cc/150?img=22',
    },
  ],
};

const data = {
  get: {
    '/api/user/1': () => user,
  },
  post: {
    '/api/user/1': (data: { name: string }) => (user.name = data.name),
  },
};

export default data;
