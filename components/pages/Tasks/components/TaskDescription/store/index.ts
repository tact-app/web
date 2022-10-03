import { RootStore } from '../../../../../../stores/RootStore';
import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../../helpers/StoreProvider';
import EditorJS from '@editorjs/editorjs';

class TaskDescriptionStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  description = '';
  ref: HTMLDivElement | null = null;
  editorInstance: null | EditorJS = null;

  init = ({ ref }: { ref: HTMLDivElement }) => {
    this.ref = ref;

    if (this.ref && !this.editorInstance) {
      this.editorInstance = new EditorJS({
        holder: this.ref,
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'Hello. Edit me',
              },
            },
          ],
        },
      });
    }
  };
}

export const {
  useStore: useTaskDescriptionStore,
  StoreProvider: TaskDescriptionStoreProvider
} = getProvider(TaskDescriptionStore);