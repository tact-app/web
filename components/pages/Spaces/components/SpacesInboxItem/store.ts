import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { TasksListStore } from '../../../../shared/TasksList/store';
import { RootStore } from '../../../../../stores/RootStore';
import { getStubDescription } from '../../modals/SpaceCreationModal/stubs';
import { SpacesInboxItemData } from '../../types';
import { KeyboardEvent } from 'react';

export type SpacesInboxItemProps = {
  item: SpacesInboxItemData;
  instance?: SpacesInboxItemStore;
  isHotkeysEnabled?: boolean;
  isExpanded?: boolean;
  callbacks?: {
    onFocus?: () => void;
    onExpand?: () => void;
    onCollapse?: () => void;
    onPreviousItem?: () => void;
    onNextItem?: () => void;
    onClose?: () => void;
  } & TasksListStore['callbacks'];
};

export class SpacesInboxItemStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  list = new TasksListStore(this.root);

  isExpanded: boolean = false;
  isHotkeysEnabled: boolean | null = null;
  item: SpacesInboxItemData | null = null;
  description: string | null = null;
  callbacks: SpacesInboxItemProps['callbacks'] = {};

  loadDescription = async () => {
    if (this.item) {
      this.description = getStubDescription(this.item.descriptionId);
    }
  };

  handleContainerKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.isExpanded) {
      e.stopPropagation();
      e.preventDefault();
      this.callbacks.onCollapse?.();
    } else if (e.key === 'e' && e.metaKey) {
      e.stopPropagation();
      e.preventDefault();
      if (this.isExpanded) {
        this.callbacks.onCollapse?.();
      } else {
        this.callbacks.onExpand?.();
      }
    }
  };

  update = (props: SpacesInboxItemProps) => {
    this.callbacks = props.callbacks || {};

    this.isExpanded = props.isExpanded || false;
    this.isHotkeysEnabled = props.isHotkeysEnabled;

    if (props.item) {
      if (this.item === null || this.item.id !== props.item.id) {
        this.item = props.item;
        this.list.reset();
        this.loadDescription();
      }
    } else {
      this.item = null;
      this.description = null;
    }
  };
}

export const {
  StoreProvider: SpacesInboxItemStoreProvider,
  useStore: useSpacesInboxItemStore,
} = getProvider(SpacesInboxItemStore);
