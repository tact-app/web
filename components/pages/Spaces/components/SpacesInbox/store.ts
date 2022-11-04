import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { RootStore } from '../../../../../stores/RootStore';
import { SpacesInboxItemData, SpacesInboxItemStatusTypes } from './types';
import { SpaceData } from '../../types';

export type SpacesInboxProps = {
  space: SpaceData;
  callbacks: {
    onFocusLeave?: (direction: 'left' | 'right') => void;
    onFocus?: () => void;
    onSelect?: (item: SpacesInboxItemData) => void;
  };
  hotkeysEnabled: boolean;
};

export class SpacesInboxStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  keyMap = {
    UP: 'up',
    DOWN: 'down',
    LEAVE_LEFT: 'left',
    LEAVE_RIGHT: 'right',
    SELECT: ['right', 'enter'],
    UNSELECT: 'escape',
  };

  hotkeysHandlers = {
    UP: () => this.navigate('up'),
    DOWN: () => this.navigate('down'),
    LEAVE_LEFT: () => {
      this.callbacks.onFocusLeave?.('left');
    },
    LEAVE_RIGHT: () => {
      this.selectFocusedItem();
      this.callbacks.onFocusLeave?.('right');
    },
    SELECT: () => this.selectFocusedItem(),
    UNSELECT: () => this.selectItem(null),
  };

  callbacks: SpacesInboxProps['callbacks'] = {};

  focusedItemId: string | null = null;
  space: SpaceData | null = null;
  items: SpacesInboxItemData[] = [];

  handleStatusChange = (id: string) => {
    const item = this.items.find((item) => item.id === id);

    if (item) {
      if (
        item.status === SpacesInboxItemStatusTypes.NEW ||
        item.status === SpacesInboxItemStatusTypes.HANDLED
      ) {
        item.status = SpacesInboxItemStatusTypes.COMPLETED;
      } else {
        item.status = SpacesInboxItemStatusTypes.HANDLED;
      }
    }
  };

  navigate = (direction: 'up' | 'down') => {
    const index = this.items.findIndex(
      (item) => item.id === this.focusedItemId
    );

    if (this.focusedItemId && index !== -1) {
      const nextIndex = direction === 'up' ? index - 1 : index + 1;
      const nextItem = this.items[nextIndex];

      if (nextItem) {
        this.focusedItemId = nextItem.id;
      }
    } else {
      if (direction === 'down') {
        this.focusedItemId = this.items[0].id;
      } else {
        this.focusedItemId = this.items[this.items.length - 1].id;
      }
    }
  };

  handleItemClick = (id: string | null) => {
    this.selectItem(id);
  };

  selectItem = (id: string | null) => {
    const item = this.items.find((item) => item.id === id);

    this.focusedItemId = id;
    this.callbacks.onSelect?.(item || null);
  };

  selectFocusedItem = () => {
    this.selectItem(this.focusedItemId);
  };

  loadItems = () => {
    this.items = [
      {
        id: '1',
        status: SpacesInboxItemStatusTypes.NEW,
        title: 'New message',
        descriptionId: 'inbox.newMessage',
        icon: '',
        origin: {
          type: 'app',
          name: 'Mail',
          id: '1',
        },
      },
      {
        id: '2',
        status: SpacesInboxItemStatusTypes.COMPLETED,
        title: 'New message 2',
        descriptionId: 'inbox.newMessage.2',
        icon: '',
        origin: {
          type: 'app',
          name: 'github',
          id: '2',
        },
      },
      {
        id: '3',
        status: SpacesInboxItemStatusTypes.NEW,
        title: 'New message 2',
        descriptionId: 'inbox.newMessage.3',
        icon: '',
        origin: {
          type: 'app',
          name: 'github',
          id: '2',
        },
      },
      {
        id: '4',
        status: SpacesInboxItemStatusTypes.NEW,
        title: 'New message 4',
        descriptionId: 'inbox.newMessage.4',
        icon: '',
        origin: {
          type: 'app',
          name: 'Jira',
          id: '3',
        },
      },
      {
        id: '5',
        status: SpacesInboxItemStatusTypes.NEW,
        title: 'New message 5',
        descriptionId: 'inbox.newMessage.5',
        icon: '',
        origin: {
          type: 'app',
          name: 'Jira',
          id: '3',
        },
      },
    ];
  };

  update = (props: SpacesInboxProps) => {
    this.callbacks = props.callbacks;
    this.space = props.space;
    this.loadItems();
  };
}

export const {
  StoreProvider: SpacesInboxStoreProvider,
  useStore: useSpacesInboxStore,
} = getProvider(SpacesInboxStore);
