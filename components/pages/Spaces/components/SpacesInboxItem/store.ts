import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { SpacesInboxItemData } from '../SpacesInbox/types';

export type SpacesInboxItemProps = {
  item: SpacesInboxItemData;
};

export class SpacesInboxItemStore {
  constructor() {
    makeAutoObservable(this);
  }

  item: SpacesInboxItemData | null = null;
  description: string | null = null;

  loadDescription = async () => {
    if (this.item) {
      this.description =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    }
  };

  update = (props: SpacesInboxItemProps) => {
    if (this.item === null || this.item.id !== props.item.id) {
      this.loadDescription();
    }

    this.item = props.item;
  };
}

export const {
  StoreProvider: SpacesInboxItemStoreProvider,
  useStore: useSpacesInboxItemStore,
} = getProvider(SpacesInboxItemStore);
