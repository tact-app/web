import { makeAutoObservable, runInAction } from 'mobx';
import { enableStaticRendering } from 'mobx-react-lite';
import { createContext, useContext } from 'react';
import UserStore from './UserStore';
import { isClient } from '../../utils';
import { getAPI } from '../../api';
import { IDBService } from '../../api/Database/IDBService';
import { MenuStore } from './MenuStore';

enableStaticRendering(typeof window === 'undefined');

export class RootStore {
  constructor() {
    makeAutoObservable(this);
  }

  isLoading = true;

  menu = new MenuStore(this);
  user = new UserStore(this);
  api = getAPI(new IDBService()); // new ApiService()

  init = async () => {
    await this.user.init();

    runInAction(() => (this.isLoading = false));
  };
}

export const StoreContext = createContext<RootStore>(null);

export function useRootStore() {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw new Error('useStore must be used within StoreProvider');
  }

  return context;
}

export function RootStoreProvider({ children }) {
  const store = new RootStore();

  if (isClient) {
    store.init();
  }

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
