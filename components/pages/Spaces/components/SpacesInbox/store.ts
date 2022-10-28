import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';

export type SpacesInboxProps = {};

export class SpacesInboxStore {
  constructor() {
    makeAutoObservable(this);
  }

  init = (props: SpacesInboxProps) => null;
}

export const {
  StoreProvider: SpacesInboxStoreProvider,
  useStore: useSpacesInboxStore,
} = getProvider(SpacesInboxStore);
