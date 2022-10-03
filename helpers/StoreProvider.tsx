import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo } from 'react';
import { RootStore, useRootStore } from '../stores/RootStore';

export interface Store<PropsType> {
  init(props: PropsType): Promise<void> | void;
}

export interface StoreConstructor<StoreType> {
  new(root: RootStore): StoreType;
}

type TypeOfClassMethod<T, M extends keyof T> = T[M] extends Function ? T[M] : never

type StorePropsType<StoreType extends Store<unknown>,
  ArgType = Parameters<TypeOfClassMethod<StoreType, 'init'>>[0]> = ArgType extends undefined ? PropsWithChildren<Record<string, any>> : ArgType

export const getProvider = <PropsType, StoreType extends Store<PropsType>>(StoreClass: StoreConstructor<StoreType>) => {
  const StoreContext = createContext<StoreType>({} as StoreType);

  type Props = StorePropsType<StoreType>

  const StoreProvider: FC<PropsWithChildren<Props>> = (props) => {
    const rootStore = useRootStore();
    const store = useMemo(() => {
      const res = new StoreClass(rootStore);

      res.init(props as PropsType);

      return res;
    }, [rootStore]);

    useEffect(() => {
      store.init(props as PropsType);
    }, [store, props]);

    return <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>;
  };

  const useStore = () => useContext(StoreContext);

  return {
    StoreProvider,
    useStore,
  };
};