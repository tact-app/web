import { makeObservable, runInAction } from 'mobx';
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
    makeObservable(this, {
      isLoading: true,
    });
  }

  keymap = {
    GOTO_TODAY: 'alt+shift+t',
    GOTO_INBOX: 'alt+shift+i',
    GOTO_GOALS: 'alt+shift+g',
  };

  hotkeysHandlers = {
    GOTO_TODAY: (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.router.push('/today');
    },
    GOTO_INBOX: (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.router.push('/inbox');
    },
    GOTO_GOALS: (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.router.push('/goals');
    },
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
