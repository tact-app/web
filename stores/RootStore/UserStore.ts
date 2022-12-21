import { makeAutoObservable } from 'mobx';
import { RootStore } from './index';

export type UserData = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  accounts: UserAccount[];
};

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export default class UserStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  isAuth: boolean = false;
  data: UserData | null = null;

  setUser = (user: UserData) => {
    this.data = user;
    this.isAuth = true;
  };

  login = async () => {
    await this.init();
  };

  logout = () => {
    this.data = null;
    this.isAuth = false;
  };

  init = async () => {
    const userData = await this.root.api.user.get('1');

    this.setUser(userData);
  };
}
