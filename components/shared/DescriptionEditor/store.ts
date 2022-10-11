import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { v4 as uuidv4 } from 'uuid';
import { Blocks, BlockTypes } from './types';
import { DraggableListStore } from '../DraggableList/store';
import { RootStore } from '../../../stores/RootStore';

export class DescriptionEditor {
  constructor(public root: RootStore) {
    makeAutoObservable(this);

    const firstBlock: Blocks = {
        id: uuidv4(),
        type: BlockTypes.PARAGRAPH,
        content: 'test content',
    }

    this.blocks = {
        [firstBlock.id]: firstBlock,
    };
    this.order = [firstBlock.id];
  }

  draggableList = new DraggableListStore(this.root);

  blocks: Record<string, Blocks> = {};
  order = [];

  addDefaultBlock = () => {
    this.addBlock();
  }

  addBlock = (id?: string) => {
    const newBlock: Blocks = {
      id: uuidv4(),
      type: BlockTypes.PARAGRAPH,
      content: 'test content',
    };

    this.blocks[newBlock.id] = newBlock;

    if (!id) {
      this.order.push(newBlock.id);
    } else {
      const index = this.order.indexOf(id);
      this.order.splice(index + 1, 0, newBlock.id);
    }
  };

  init = () => null;
}

export const {
  StoreProvider: DescriptionEditorStoreProvider,
  useStore: useDescriptionEditorStore,
} = getProvider(DescriptionEditor);