import { RootStore } from '../../../../../stores/RootStore';
import { makeAutoObservable, reaction, runInAction, toJS } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { TaskData } from '../../types';
import { TaskQuickEditorStore } from '../TaskQuickEditor/store';
import { DescriptionData } from '../../../../../types/description';
import { JSONContent } from '@tiptap/core';
import { v4 as uuidv4 } from 'uuid';

export type TaskProps = {
  callbacks: {
    onClose: () => void;
    onNextItem: (taskId: string) => void;
    onPreviousItem: (taskId: string) => void;
  };
  task: TaskData;
};

class TaskStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  quickEditor: TaskQuickEditorStore = new TaskQuickEditorStore(this.root);

  callbacks: TaskProps['callbacks'];
  data: TaskData | null = null;
  isDescriptionLoading: boolean = true;
  description: DescriptionData | null = null;

  handleDescriptionChange = (content: JSONContent) => {
    this.description.content = content;
  };

  setDescription = (description?: DescriptionData) => {
    if (description) {
      this.description = description;
    } else {
      this.description = {
        id: uuidv4(),
        content: undefined,
      };

      this.data.descriptionId = this.description.id;
      this.root.api.tasks.update({
        id: this.data.id,
        fields: {
          descriptionId: this.description.id,
        },
      });
      this.root.api.descriptions.add({
        id: this.description.id,
        content: toJS(this.description.content),
      });
    }
  };

  handleDescriptionBlur = () => {
    if (this.description.content) {
      console.log('save description');
      this.root.api.descriptions.update({
        id: this.description.id,
        fields: {
          content: toJS(this.description.content),
        },
      });
    }
  };

  handleNextItem = () => {
    this.handleDescriptionBlur();
    this.callbacks.onNextItem(this.data?.id);
  };

  handlePreviousItem = () => {
    this.handleDescriptionBlur();
    this.callbacks.onPreviousItem(this.data?.id);
  };

  handleClose = () => {
    this.handleDescriptionBlur();
    this.callbacks.onClose();
  };

  loadDescription = async () => {
    this.isDescriptionLoading = true;

    const description = this.data?.descriptionId
      ? await this.root.api.descriptions.get(this.data.descriptionId)
      : null;

    this.setDescription(description);

    runInAction(() => (this.isDescriptionLoading = false));
  };

  subscribe = () =>
    reaction(() => this.data?.id, this.loadDescription, {
      fireImmediately: true,
    });

  init = (props: TaskProps) => {
    this.data = props.task;
    this.callbacks = props.callbacks;
  };
}

export const { useStore: useTaskStore, StoreProvider: TaskStoreProvider } =
  getProvider(TaskStore);
