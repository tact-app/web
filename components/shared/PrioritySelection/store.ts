import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';

export type PrioritySelectionProps = {
  callbacks?: {
    onSelect?: (goalIds: string[]) => void;
  };

  setRefs?: (index: number, ref: HTMLElement) => void;
  checked?: string[];
};

export class PrioritySelectionStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  callbacks: PrioritySelectionProps['callbacks'] = {};

  checkedPriority: Record<string, boolean> = {};
  isFocused: boolean = false;
  multiple: boolean = false;

  get checked() {
    return Object.keys(this.checkedPriority);
  }

  handlePriorityCheck = (key: string) => {
    const priority = key === null ? null : key;
    if (priority !== null) {
      this.checkedPriority = {
        [priority]: true,
      };
    } else {
      this.checkedPriority = {};
    }

    this.callbacks.onSelect?.(this.checked);
  };

  uncheckAll = () => {
    this.checkedPriority = {};
    this.callbacks.onSelect?.(this.checked);
  };

  update = (props: PrioritySelectionProps) => {
    this.callbacks = props.callbacks;

    if (props.checked) {
      this.checkedPriority = {
        [props.checked[0]]: true,
      };
    }
  };
}

export const {
  StoreProvider: PrioritySelectionStoreProvider,
  useStore: usePrioritySelectionStore,
} = getProvider(PrioritySelectionStore);
