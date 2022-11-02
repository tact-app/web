import { makeAutoObservable, runInAction } from 'mobx';
import { enableStaticRendering } from 'mobx-react-lite';
import { createContext, PropsWithChildren, useContext } from 'react';
import UserStore from './UserStore';
import { isClient } from '../../utils';
import { getAPI } from '../../services/api';
import { IDBService } from '../../services/api/Database/IDBService';
import { MenuStore } from './MenuStore';
import { NextRouter } from 'next/router';

enableStaticRendering(typeof window === 'undefined');

export class RootStore {
  constructor() {
    makeAutoObservable(this);
  }

  keymap = {
    GOTO_TODAY: 'ctrl+shift+t',
    GOTO_INBOX: 'ctrl+shift+i',
    GOTO_GOALS: 'ctrl+shift+g',
  };

  hotkeysHandlers = {
    GOTO_TODAY: () => this.router.push('/today'),
    GOTO_INBOX: () => this.router.push('/inbox'),
    GOTO_GOALS: () => this.router.push('/goals'),
  };

  isLoading = true;
  router: NextRouter;

  menu = new MenuStore(this);
  user = new UserStore(this);
  api = getAPI(new IDBService()); // new ApiService()

  setRouter = (router: NextRouter) => {
    this.router = router;
  };

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

export function RootStoreProvider({
  children,
  router,
}: PropsWithChildren<{ router: NextRouter }>) {
  const store = new RootStore();

  if (isClient) {
    store.init();
  }

  store.setRouter(router);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
