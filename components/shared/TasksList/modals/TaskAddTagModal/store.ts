import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { ListNavigation } from '../../../../../helpers/ListNavigation';
import { RootStore } from '../../../../../stores/RootStore';
import { TaskTag } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export type TaskAddTagModalProps = {
  callbacks: {
    onClose: () => void;
    onSave: (tags: TaskTag[]) => void;
  },
  tags: string[];
};

export class TaskAddTagModalStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }
  selectedTags: TaskTag[];

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

  get availableTags() {
    return this.root.resources.tags.list;
  }

  callbacks: TaskAddTagModalProps['callbacks'];

  removeTag = (id: string) => {
    this.selectedTags = this.selectedTags.filter((tag) => tag.id !== id);
  };

  addTag = (tag: TaskTag) => {
    this.selectedTags.push(tag);
  };

  createNewTag = (newTagTitle: string) => {

    const hasTag = this.availableTags.some(
      ({ title: tagTitle }) => tagTitle === newTagTitle
    );

    if (!hasTag) {
      const id = uuidv4();
      const newTag = { title: newTagTitle, id };

      this.addTag(newTag);
      this.root.resources.tags.add(newTag);
    }
  };

  addAvailableTag = (id: string) => {
    if (!this.availableTags.some(({ id: tagId }) => tagId === id)) {
      const tag = this.availableTags.find((tag) => tag.id === id);

      this.addTag(tag);
    }
  };

  handleSave = () => {
    this.callbacks.onSave(this.selectedTags);
  };

  update = ({ callbacks, tags }: TaskAddTagModalProps) => {
    this.selectedTags = this.availableTags.filter(({ id }) => tags.includes(id));
    this.callbacks = callbacks;
  };

  navigationCallbacks = {
    onForceEnter: () => {
      this.handleSave();
    },
  };

  navigation = new ListNavigation(this.navigationCallbacks);
}

export const {
  StoreProvider: TaskAddTagModalStoreProvider,
  useStore: useTaskAddTagModalStore,
} = getProvider(TaskAddTagModalStore);
