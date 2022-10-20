import { RootStore } from '../../../../../../stores/RootStore';
import { makeAutoObservable, reaction } from 'mobx';
import { getProvider } from '../../../../../../helpers/StoreProvider';
import { TaskData } from '../../../types';

import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';

class TaskDescriptionStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  data: TaskData | null = null;
  ref: HTMLDivElement | null = null;
  editorInstance: null | EditorJS = null;
  closeTask: null | (() => void) = null;

  setRef = (ref: HTMLDivElement) => {
    this.ref = ref;
  };

  init = ({ task, close }: { task: TaskData; close: () => void }) => {
    this.data = task;
    this.closeTask = close;
  };

  subscribe = () =>
    reaction(
      () => [this.data, this.ref],
      () => {
        if (this.data && this.ref) {
          if (!this.editorInstance) {
            this.editorInstance = new EditorJS({
              holder: this.ref,
              data: this.data?.description,
              inlineToolbar: true,
              onReady: () => {
                new Undo({
                  editor: this.editorInstance,
                  config: {
                    shortcuts: {
                      undo: 'CMD+Z',
                      redo: 'CMD+SHIFT+Z',
                    },
                  },
                });
                new DragDrop(this.editorInstance);
              },
              tools: {
                header: {
                  class: Header,
                  shortcut: 'CMD+SHIFT+H',
                  config: {
                    placeholder: 'Enter a header',
                    levels: [1, 2, 3, 4],
                    defaultLevel: 1,
                  },
                },
              },
            });
          } else if (this.editorInstance) {
            this.editorInstance.render(this.data?.description);
          }
        }
      },
      { fireImmediately: true }
    );
}

export const {
  useStore: useTaskDescriptionStore,
  StoreProvider: TaskDescriptionStoreProvider,
} = getProvider(TaskDescriptionStore);
