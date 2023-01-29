import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';
import { Editor, Extension, Extensions, JSONContent } from '@tiptap/core';
import { StarterKit } from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import getRenderer from './extensions/CommandsExtension/renderer';
import { Underline } from '@tiptap/extension-underline';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { Commands } from './extensions/CommandsExtension';
import { EditorCreateMenuStore } from './components/EditorCreateMenu/store';
import { EditorCreateMenu } from './components/EditorCreateMenu';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { MetricExtension } from './extensions/MetricExtension';
import { BlockTypesOptions } from './slashCommands';
import { NavigationDirections } from '../TasksList/types';
import { TrailingNode } from './extensions/TrailingNode';
import { KeyboardEvent, SyntheticEvent } from 'react';
import { Validators } from "../../../helpers/validators";

export type EditorProps = {
  content: JSONContent;

  editorRef?: (editor: Editor) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSave?: () => void;
  onLeave?: (direction: NavigationDirections) => void;
  onUpdate?: (content: JSONContent) => void;
};

class EditorStore {
  isLinkFormOpened: boolean = false;

  converterMenu: EditorCreateMenuStore;

  onFocus: EditorProps['onFocus'];
  onBlur: EditorProps['onBlur'];
  onUpdate: EditorProps['onUpdate'];
  onSave: EditorProps['onSave'];
  onLeave: EditorProps['onLeave'];
  editorRef: EditorProps['editorRef'];

  content: JSONContent = undefined;
  isFocused = false;
  ref: HTMLDivElement;

  editor: Editor | null = null;

  extensions: Extensions;
  linkValue: string = '';

  constructor(public root: RootStore) {
    makeAutoObservable(this, undefined, { autoBind: true });

    const converterMenu = new EditorCreateMenuStore();

    const handleSave = this.handleSave.bind(this);
    const handleLeave = this.handleLeave.bind(this);
    const openLinkForm = this.openLinkForm.bind(this);

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
      Highlight.configure(),
      Link.configure(),
      Commands.configure({
        suggestion: {
          items: ({ query }) => {
            return BlockTypesOptions.map(({ options, name }) => ({
              name,
              options: options.filter(({ label }) =>
                label.toLowerCase().startsWith(query.toLowerCase())
              ),
            })).slice(0, 10);
          },
          render: getRenderer(EditorCreateMenu, this.converterMenu),
        } as any, // ToDo fix types
      }),
      Extension.create({
        addKeyboardShortcuts() {
          return {
            Escape: ({ editor }) => {
              if (converterMenu.isOpen) {
                converterMenu.handleClose();
                return false;
              }

              return editor.commands.blur();
            },
            'Cmd-s': () => {
              handleSave?.();
              return true;
            },
            ArrowUp: ({ editor }) => {
              if (editor.state.selection.from <= 1) {
                editor.commands.blur();
                handleLeave(NavigationDirections.UP);
                return true;
              }

              return false;
            },
            'Cmd-x': ({ editor }) => editor.chain().focus().toggleStrike().run(),
            'Cmd-h': ({ editor }) => editor.chain().focus().toggleHighlight().run(),
            'Cmd-l': () => {
              openLinkForm();
              return true;
            }
          };
        },
      }),
      TrailingNode,
    ];
  }

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

  handleLeave = (direction: NavigationDirections) => {
    this.onLeave?.(direction);
  };

  handleEditorUpdate = ({ editor }) => {
    this.onUpdate(this.editor.getJSON());
  };

  setEditor = (editor: Editor) => {
    this.editor = editor;

    if (this.editor) {
      this.editorRef?.(this.editor);
      this.editor.on('update', this.handleEditorUpdate);
    }
  };

  update = (props: EditorProps) => {
    this.content = props.content;

    this.onUpdate = props.onUpdate;
    this.onFocus = props.onFocus;
    this.onBlur = props.onBlur;
    this.onSave = props.onSave;
    this.onLeave = props.onLeave;
    this.editorRef = props.editorRef;
  };

  openLinkForm = () => {
    this.isLinkFormOpened = true;
    this.linkValue = this.editor.getAttributes('link').href;
  }

  closeLinkForm = () => {
    this.isLinkFormOpened = false;
  }

  handleLinkInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();

    if (event.key === 'Escape') {
      return this.closeLinkForm();
    }

    if (event.key === 'Enter') {
      const editorFocus = this.editor.chain().focus();
      const href = this.linkValue.trim();

      if (Validators.isValidUrl(href)) {
        editorFocus.setLink({ href, target: '_blank' }).run();
      } else {
        editorFocus.unsetLink().run();
      }

      return this.closeLinkForm();
    }
  }

  updateLinkValue(event: SyntheticEvent<HTMLInputElement>) {
    this.linkValue = (event.target as HTMLInputElement).value;
  }
}

export const { StoreProvider: EditorStoreProvider, useStore: useEditorStore } =
  getProvider(EditorStore);
