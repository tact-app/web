import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';

export type SpacesProps = {};

export class SpacesStore {
  constructor() {
    makeAutoObservable(this);
  }

  init = (props: SpacesProps) => null;
}

export const { StoreProvider: SpacesStoreProvider, useStore: useSpacesStore } =
  getProvider(SpacesStore);
