import { makeObservable, observable, action, computed } from 'mobx';
import { UserProfile } from '@auth0/nextjs-auth0/client';

class UserStoreClass {
  user: UserProfile;

  get isLoaded() {
    return Boolean(this.user);
  }

  constructor() {
    makeObservable(this, {
      user: observable,
      isLoaded: computed,
      setUser: action.bound,
    });
  }

  setUser(user: UserProfile) {
    this.user = user;
  }
}

export const UserStore = new UserStoreClass();
