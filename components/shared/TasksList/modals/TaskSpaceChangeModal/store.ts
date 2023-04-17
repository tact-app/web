import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { SpacesSelectionStore } from '../../../SpacesSelection/store';
import { ListNavigation } from '../../../../../helpers/ListNavigation';

export type TaskSpaceChangeModalProps = {
  callbacks: {
    onClose?: () => void;
    onSelect?: (spaceId: string) => void;
    onSpaceCreateClick?: () => void;
  };
  multiple?: boolean;
  spaceId: string;
};

export class TaskSpaceChangeModalStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  callbacks: TaskSpaceChangeModalProps['callbacks'] = {};

  spacesSelection = new SpacesSelectionStore(this.root);

  emptyRef: HTMLInputElement | null = null;
  selectedSpaceId: string | null = null;
  multiple: boolean = false;

  keyMap = {
    FORCE_ENTER: ['meta+enter'],
  };

  hotkeyHandlers = {
    FORCE_ENTER: (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.navigation.hotkeyHandlers.FORCE_ENTER?.(e);
    },
  };

  handleSelect = (spaceIds: string[]) => {
    this.selectedSpaceId = spaceIds[0];
  };

  handleSubmit = () => {
    this.callbacks.onSelect?.(this.selectedSpaceId);
  };

  update = (props: TaskSpaceChangeModalProps) => {
    this.callbacks = props.callbacks;
    this.multiple = props.multiple;

    this.selectedSpaceId = props.spaceId;
  };

  navigation = new ListNavigation({
    onForceEnter: this.handleSubmit,
  });
}

export const {
  StoreProvider: TaskSpaceChangeModalStoreProvider,
  useStore: useTaskSpaceChangeModalStore,
} = getProvider(TaskSpaceChangeModalStore);
