import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';
import { BlockTypesOptions } from './types';
import { Editor, Extension, Extensions, JSONContent } from '@tiptap/core';
import { StarterKit } from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import getRenderer from './extensions/CommandsExtension/renderer';
import { Underline } from '@tiptap/extension-underline';
import { Commands } from './extensions/CommandsExtension';
import { EditorCreateMenuStore } from './components/EditorCreateMenu/store';
import { EditorCreateMenu } from './components/EditorCreateMenu';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { MetricExtension } from './extensions/MetricExtension';

export type EditorProps = {
  content: JSONContent;
  isFocused?: boolean;

  onFocus?: () => void;
  onBlur?: () => void;
  onSave?: () => void;
  onUpdate?: (content: JSONContent) => void;
};

class EditorStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);

    const converterMenu = new EditorCreateMenuStore();

    const handleSave = this.handleSave.bind(this);

    this.converterMenu = converterMenu;

    this.extensions = [
      StarterKit,
      Underline.configure(),
      Placeholder.configure({
        placeholder: 'Type / to open commands list',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      MetricExtension,
      Commands.configure({
        suggestion: {
          items: ({ query }) => {
            return BlockTypesOptions.filter(({ label }) =>
              label.toLowerCase().startsWith(query.toLowerCase())
            ).slice(0, 10);
          },
          render: getRenderer(EditorCreateMenu, this.converterMenu),
        } as any, // ToDo fix types
      }),
      Extension.create({
        addKeyboardShortcuts() {
          return {
            Escape: ({ editor }) => editor.commands.blur(),
            'Cmd-s': () => {
              handleSave?.();
              return true;
            },
          };
        },
      }),
    ];
  }

  converterMenu: EditorCreateMenuStore;

  onFocus: EditorProps['onFocus'];
  onBlur: EditorProps['onBlur'];
  onUpdate: EditorProps['onUpdate'];
  onSave: EditorProps['onSave'];

  isBlocksMenuOpen: boolean = false;

  content: JSONContent = undefined;
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
    this.onFocus?.();
  };

  handleBlur = () => {
    this.onBlur?.();
  };

  handleFocus = () => {
    this.onFocus?.();
  };

  handleSave = () => {
    this.onSave?.();
  };

  handleEditorUpdate = ({ editor }) => {
    this.onUpdate(this.editor.getJSON());
  };

  setEditor = (editor: Editor) => {
    this.editor = editor;

    if (this.editor) {
      this.editor.on('update', this.handleEditorUpdate);

      if (this.isFocused) {
        this.editor.on('create', () => this.editor.commands.focus());
      }
    }
  };

  update = (props: EditorProps) => {
    this.content = props.content;
    this.isFocused = props.isFocused;

    this.onUpdate = props.onUpdate;
    this.onFocus = props.onFocus;
    this.onBlur = props.onBlur;
    this.onSave = props.onSave;
  };
}

export const { StoreProvider: EditorStoreProvider, useStore: useEditorStore } =
  getProvider(EditorStore);
