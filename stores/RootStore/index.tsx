import { makeObservable, observable, runInAction } from 'mobx';
import { enableStaticRendering } from 'mobx-react-lite';
import { createContext, PropsWithChildren, useContext } from 'react';
import UserStore from './UserStore';
import { isClient } from '../../utils';
import { getAPI } from '../../services/api';
import { IDBService } from '../../services/api/Database/IDBService';
import { MenuStore } from './MenuStore';
import { NextRouter } from 'next/router';
import { SpacesStore } from './Resources/SpacesStore';
import { TagsStore } from './Resources/TagsStore';
import { GoalsStore } from './Resources/GoalsStore';
import { ModalsController } from "../../helpers/ModalsController";
import { ConfirmDialog, ConfirmDialogProps } from "../../components/shared/ConfirmDialog";

enableStaticRendering(typeof window === 'undefined');

export enum GlobalModalsEnum {
  CONFIRM = 'confirm'
}

const GlobalModals = {
  [GlobalModalsEnum.CONFIRM]: ConfirmDialog
};

export class RootStore {
  globalModals = new ModalsController(GlobalModals);

  constructor() {
    makeObservable(this, {
      isLoading: true,
      isModalOpen: observable,
    });
  }

  keymap = {
    GOTO_TODAY: ['alt+shift+t', 'option+shift+t'],
    GOTO_INBOX: ['alt+shift+i', 'option+shift+i'],
    GOTO_GOALS: ['alt+shift+g', 'option+shift+g'],
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
  isModalOpen = false;
  router: NextRouter;

  resources = {
    spaces: new SpacesStore(this),
    tags: new TagsStore(this),
    goals: new GoalsStore(this),
  };
  menu = new MenuStore(this);
  user = new UserStore(this);
  api = getAPI(new IDBService()); // new ApiService()

  setRouter = (router: NextRouter) => {
    this.router = router;
  };

  toggleModal = (isOpen: boolean) => {
    this.isModalOpen = isOpen
  };

  confirm = (props: Omit<ConfirmDialogProps, 'onClose' | 'onSubmit'>) => {
    return new Promise((resolve) => {
      this.globalModals.open({
        type: GlobalModalsEnum.CONFIRM,
        props: {
          ...props,
          onSubmit: () => {
            resolve(true);
            this.globalModals.close();
          },
          onClose: () => {
            resolve(false);
            this.globalModals.close();
          },
        },
      });
    });
  };

  init = async () => {
    await this.user.init();
    await Promise.all([
      this.resources.spaces.init(),
      this.resources.tags.init(),
      this.resources.goals.init(),
    ]);

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
