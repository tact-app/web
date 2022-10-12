import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { v4 as uuidv4 } from 'uuid';
import { Blocks, BlockValues } from './types';
import { DraggableListCallbacks, DraggableListStore } from '../DraggableList/store';
import { RootStore } from '../../../stores/RootStore';

const getNewBlock = (type: BlockValues, config?: any) => ({
  'type': 'doc',
  'content': [
    {
      'attrs': config,
      'type': type,
      'content': type === BlockValues.BULLET_LIST || type === BlockValues.ORDERED_LIST ? [
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
              ]
            }
          ]
        }
      ] : []
    }
  ]
});

const getBlock = (type: BlockValues = BlockValues.PARAGRAPH, config?: any) => ({
  id: uuidv4(),
  type: type,
  content: getNewBlock(type, config),
});

export class DescriptionEditor {
  constructor(public root: RootStore) {
    makeAutoObservable(this);

    const firstBlock: Blocks = getBlock();
    this.blocks = {
      [firstBlock.id]: firstBlock,
    };
    this.order = [firstBlock.id];
  }

  draggableList = new DraggableListStore(this.root);

  openedBlocksMenuId: string | null = null;
  blocks: Record<string, Blocks> = {};
  order = [];

  draggableCallbacks: DraggableListCallbacks = {
    onOrderChange: (order: string[]) => {
      this.order = order;
    },
    onItemsRemove: (items: string[]) => {
      this.order = items;
    }
  };

  openBlocksMenu = (id: string) => {
    this.openedBlocksMenuId = id;
  };

  closeBlocksMenu = () => {
    this.openedBlocksMenuId = null;
  };

  addDefaultBlock = () => {
    this.addBlock();
  };

  updateBlock = (id: string, content: Blocks['content']) => {
    this.blocks[id].content = content;
  };

  removeBlock = (id: string) => {
    if (this.order.length > 1) {
      const currentBlockIndex = this.order.indexOf(id);

      delete this.blocks[id];
      this.draggableList.deleteItems([id]);

      if (currentBlockIndex !== -1) {
        if (currentBlockIndex === 0) {
          this.draggableList.setFocusedItem(this.order[0]);
        } else {
          this.draggableList.setFocusedItem(this.order[currentBlockIndex - 1]);
        }
      }
    }
  }

  addBlock = (id?: string, type?: BlockValues, config?: any) => {
    const newBlock: Blocks = getBlock(type, config);

    this.blocks[newBlock.id] = newBlock;

    if (!id) {
      this.order.push(newBlock.id);
    } else {
      const index = this.order.indexOf(id);
      this.order.splice(index + 1, 0, newBlock.id);
    }

    this.draggableList.setFocusedItem(newBlock.id);

    this.closeBlocksMenu();
  };

  init = () => null;
}

export const {
  StoreProvider: DescriptionEditorStoreProvider,
  useStore: useDescriptionEditorStore,
} = getProvider(DescriptionEditor);