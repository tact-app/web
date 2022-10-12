import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { Blocks, BlockTypesOptions } from '../../types';
import { Editor, Extension, Extensions } from '@tiptap/core';
import { StarterKit } from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import getRenderer from './plugins/CommandsPlugin/renderer';
import { DescriptionEditorCreateMenu } from '../DescriptionEditorCreateMenu';
import { DescriptionEditorCreateMenuStore } from '../DescriptionEditorCreateMenu/store';
import { Underline } from '@tiptap/extension-underline';
import { Commands } from './plugins/CommandsPlugin';

export type DescriptionEditorBlockProps = {
  id: string;
  block: Blocks;
  isFocused: boolean;

  onFocus: (id: string) => void;
  onUpdate: (id: string, content: Blocks['content']) => void;
  onRemove: (id: string) => void;
  onBlockCreate: (id: string) => void;
}

class DescriptionEditorBlockStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);

    const createBlock = this.handleBlockCreation.bind(this);
    const removeBlock = () => this.onRemove?.(this.id);

    const converterMenu = new DescriptionEditorCreateMenuStore();

    this.converterMenu = converterMenu;

    this.extensions = [
      StarterKit,
      Underline.configure(),
      Placeholder.configure({
        placeholder: 'Type / to open items list'
      }),
      Commands.configure({
        suggestion: {
          items: (({ query }) => {
            return BlockTypesOptions
              .filter(({ label }) => label.toLowerCase().startsWith(query.toLowerCase()))
              .slice(0, 10);
          }),
          render: getRenderer(DescriptionEditorCreateMenu, this.converterMenu)
        } as any // ToDo fix types
      }),
      Extension.create({
        addKeyboardShortcuts() {
          return {
            'CMD-ArrowUp': () => {
              return false
            },
            Delete: () => {
              // if (editor.state.selection.empty) {
              //   removeBlock();
              // }

              return false;
            },
            Backspace: ({ editor }) => {
              if (editor.state.doc.textContent === '') {
                removeBlock();
                return true;
              }

              return false;
            },
            Enter: () => {
              if (!converterMenu.isOpen) {
                createBlock();
                return true;
              } else {
                return false;
              }
            },
          };
        },
      })
    ];
  }

  converterMenu: DescriptionEditorCreateMenuStore;

  onFocus: DescriptionEditorBlockProps['onFocus'];
  onUpdate: DescriptionEditorBlockProps['onUpdate'];
  onBlockCreate: DescriptionEditorBlockProps['onBlockCreate'];
  onRemove: DescriptionEditorBlockProps['onRemove'];

  isBlocksMenuOpen: boolean = false;

  block: Blocks;
  id: string;
  isFocused = false;
  ref: HTMLDivElement;

  editor: Editor | null = null;

  extensions: Extensions;

  openBlocksMenu = () => {
    this.isBlocksMenuOpen = true;
  };

  closeBlocksMenu = () => {
    this.isBlocksMenuOpen = false;
  };

  handleClick = () => {
    this.onFocus(this.id);
  };

  handleBlockCreation = () => {
    this.onBlockCreate(this.id);
  };

  setEditor = (editor: Editor) => {
    this.editor = editor;

    if (this.editor) {
      this.editor.on('update', () => {
        this.onUpdate(this.id, this.editor.getJSON());
      });

      if (this.isFocused) {
        this.editor.on('create', () => this.editor.commands.focus());
      }
    }
  };

  init = (props: DescriptionEditorBlockProps) => {
    this.block = props.block;
    this.id = props.id;
    this.isFocused = props.isFocused;

    if (this.editor) {
      if (this.isFocused) {
        this.editor.setEditable(true);
        this.editor.commands.focus();
      } else {
        this.editor.setEditable(false);
      }
    }

    this.onUpdate = props.onUpdate;
    this.onFocus = props.onFocus;
    this.onBlockCreate = props.onBlockCreate;
    this.onRemove = props.onRemove;
  };
}

export const {
  StoreProvider: DescriptionEditorBlockStoreProvider,
  useStore: useDescriptionEditorBlockStore,
} = getProvider(DescriptionEditorBlockStore);