import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';

export type SpacesSelectionProps = {
  callbacks?: {
    onSelect?: (goalIds: string[]) => void;
    onSpaceCreateClick?: () => void;
  };

  setRefs?: (index: number, ref: HTMLElement) => void;
  checked?: string[];
};

export class SpacesSelectionStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  callbacks: SpacesSelectionProps['callbacks'] = {};

  checkedSpace: Record<string, boolean> = {};
  isFocused: boolean = false;
  multiple: boolean = false;

  get filteredSpaces() {
    return this.root.resources.spaces.list.filter(({ type }) => type !== 'all');
  }

  get checked() {
    return Object.keys(this.checkedSpace);
  }

  handleSpaceCheck = (index: number | null) => {
    const spaceId = index === null ? null : this.filteredSpaces[index].id;
    if (spaceId !== null) {
      this.checkedSpace = {
        [spaceId]: true,
      };
    } else {
      this.checkedSpace = {};
    }

    this.callbacks.onSelect?.(this.checked);
  };

  uncheckAll = () => {
    this.checkedSpace = {};
    this.callbacks.onSelect?.(this.checked);
  };

  update = (props: SpacesSelectionProps) => {
    this.callbacks = props.callbacks;

    if (props.checked) {
      this.checkedSpace = {
        [props.checked[0]]: true,
      };
    }
  };
}

export const {
  StoreProvider: SpacesSelectionStoreProvider,
  useStore: useSpacesSelectionStore,
} = getProvider(SpacesSelectionStore);
