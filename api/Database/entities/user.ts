import { UserData } from '../../../stores/RootStore/UserStore';

const user: UserData = {
  id: '1',
  name: 'John Doe',
  email: 'test@test.ts',
  avatar: 'https://via.placeholder.com/150',
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
