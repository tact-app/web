import { makeObservable, action, observable } from 'mobx';
import { useEffect, useState } from 'react';

export enum GlobalHooks {
  MetaEnter = 'meta-enter',
}

export type GlobalHooksCallbacks = Record<GlobalHooks, (event: KeyboardEvent) => void>;

class GlobalHooksStoreClass {
  isEventListenerCreated: boolean = false;
  isEventListenerRemoved: boolean = false;
  globalHooksCallbacks?: GlobalHooksCallbacks;

  constructor() {
    makeObservable(this, {
      isEventListenerCreated: observable,
      globalHooksCallbacks: observable,
      isEventListenerRemoved: observable,

      setGlobalHooks: action.bound,
      globalKeyDownEventListener: action.bound,
    });
  }

  setGlobalHooks = (hooksWithCallbacks: GlobalHooksCallbacks) => {
    this.globalHooksCallbacks = hooksWithCallbacks;

    if (Object.keys(this.globalHooksCallbacks).length) {
      this.isEventListenerCreated = true;
      document.addEventListener('keydown', this.globalKeyDownEventListener, { capture: true });
    }
  };

  globalKeyDownEventListener = (event: KeyboardEvent) => {
    if (this.globalHooksCallbacks[GlobalHooks.MetaEnter] && event.key === 'Enter' && event.metaKey) {
      this.globalHooksCallbacks[GlobalHooks.MetaEnter]?.(event);
    }
  };

  destroy = () => {
    if (this.isEventListenerCreated) {
      this.isEventListenerCreated = false;
      this.isEventListenerRemoved = true;
      document.removeEventListener('keydown', this.globalKeyDownEventListener, { capture: true });
    }
  };
}

export const GlobalHooksStore = new GlobalHooksStoreClass();

export function useGlobalHook(
  hooksWithCallbacks: GlobalHooksCallbacks,
  params: { updateWhenRemoved?: boolean } = {},
  dependencies: unknown[] = []
) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (
      !isInitialized ||
      !GlobalHooksStore.isEventListenerCreated ||
      (params.updateWhenRemoved && GlobalHooksStore.isEventListenerRemoved)
    ) {
      setIsInitialized(true);
      GlobalHooksStore.setGlobalHooks(hooksWithCallbacks);
    }
  }, [
    isInitialized,
    hooksWithCallbacks,
    params.updateWhenRemoved,
    GlobalHooksStore.isEventListenerCreated,
    GlobalHooksStore.isEventListenerRemoved,
    ...dependencies
  ]);

  useEffect(() => {
    return () => GlobalHooksStore.destroy();
  }, []);
}
