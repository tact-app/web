import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { RootStore, useRootStore } from '../stores/RootStore';

export interface Store<PropsType> {
  init?(props: PropsType): Promise<void> | void;
  update(props: PropsType): void;

  subscribe?(): () => void;
}

export interface StoreConstructor<StoreType> {
  new (root: RootStore): StoreType;
}

type TypeOfClassMethod<T, M extends keyof T> = T[M] extends Function
  ? T[M]
  : never;

type StorePropsType<
  StoreType extends Store<unknown>,
  ArgType = Parameters<TypeOfClassMethod<StoreType, 'update'>>[0]
> = ArgType extends undefined
  ? PropsWithChildren<Record<string, any>>
  : ArgType;

export const getProvider = <PropsType, StoreType extends Store<PropsType>>(
  StoreClass: StoreConstructor<StoreType>
) => {
  const StoreContext = createContext<StoreType>({} as StoreType);

  type Props = StorePropsType<StoreType> & {
    instance?: StoreType;
    useInstance?: () => StoreType;
  };

  const StoreProvider: FC<PropsWithChildren<Props>> = (props) => {
    const rootStore = useRootStore();
    const existedStore = props.instance
      ? props.instance
      : props.useInstance
      ? props.useInstance()
      : undefined;
    const store = useMemo(() => {
      const res = existedStore || new StoreClass(rootStore);

      res.update?.(props as PropsType);

      return res;
    }, [rootStore, existedStore]);

    useEffect(() => {
      store.update?.(props as PropsType);
    }, [props, store]);

    useEffect(() => {
      store.init?.(props as PropsType);
    }, [store]);

    useEffect(() => {
      if (store.subscribe) {
        return store.subscribe();
      }
    }, [store]);

    return (
      <StoreContext.Provider value={store}>
        {props.children}
      </StoreContext.Provider>
    );
  };

  const useStore = () => useContext(StoreContext);

  return {
    StoreProvider,
    useStore,
  };
};
