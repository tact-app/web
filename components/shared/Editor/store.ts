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
import { NavigationDirections } from '../../../types/navigation';
import { TrailingNode } from './extensions/TrailingNode';
import { KeyboardEvent, SyntheticEvent } from 'react';
import { ChakraProps } from "@chakra-ui/system/dist/system.types";

export type EditorProps = {
  content: JSONContent;
  contentContainerProps?: ChakraProps;

  editorRef?: (editor: Editor) => void;
  onFocus?: () => void;
  onBlur?: (event: FocusEvent) => void;
  onSave?: () => void;
  onLeave?: (direction: NavigationDirections) => void;
  onUpdate?: (content: JSONContent) => void;
};

export const EDITOR_ROOT_ID = 'editor-root';

class EditorStore {
  isLinkInfoOpened: boolean = false;
  initialLinkValue: string = '';
  isLinkFormOpened: boolean = false;

  converterMenu: EditorCreateMenuStore;

  onFocus: EditorProps['onFocus'];
  onBlur: EditorProps['onBlur'];
  onUpdate: EditorProps['onUpdate'];
  onSave: EditorProps['onSave'];
  onLeave: EditorProps['onLeave'];
  editorRef: EditorProps['editorRef'];

  content: JSONContent = undefined;
  contentContainerProps: EditorProps['contentContainerProps'] = {};
  isFocused = false;
  ref: HTMLDivElement;

  editor: Editor | null = null;

  extensions: Extensions;

  linkValue: string = '';
  linkTitle: string = '';
  initialLinkTitle: string = '';

  editorContainerRef: HTMLElement | null = null;

  constructor(public root: RootStore) {
    makeAutoObservable(this, undefined, { autoBind: true });

    const converterMenu = new EditorCreateMenuStore();

    const handleSave = this.handleSave.bind(this);
    const handleLeave = this.handleLeave.bind(this);
    const openLinkInfo = this.openLinkInfo.bind(this);

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
            'Cmd-Shift-x': ({ editor }) => editor.chain().focus().toggleStrike().run(),
            'Cmd-h': ({ editor }) => editor.chain().focus().toggleHighlight().run(),
            'Cmd-l': () => {
              openLinkInfo();
              return true;
            }
          };
        },
      }),
      TrailingNode,
    ];
  }

  handleClick = (event: SyntheticEvent<HTMLDivElement>) => {
    this.onFocus?.();

    if ((event.target as HTMLDivElement).id === EDITOR_ROOT_ID) {
      this.editor.commands.focus('end');
    }
  };

  handleBlur = ({ event }: { event: FocusEvent }) => {
    this.onBlur?.(event);
  };

  handleFocus = () => {
    this.onFocus?.();
  };

  handleSave = () => {
    this.onSave?.();
  };

  handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      const lastChildNodeIndex = this.editor.state.doc.content.childCount - 2;

      if (lastChildNodeIndex < 0) {
        return;
      }

      const lastChildNode = this.editor.state.doc.content.child(lastChildNodeIndex);
      const cursorNode = this.editor.state.selection.$head.parent;

      if (lastChildNode === cursorNode) {
        this.editorContainerRef?.scrollIntoView({ block: 'end' });
      }
    }
  }

  handleLeave = (direction: NavigationDirections) => {
    this.onLeave?.(direction);
  };

  handleEditorUpdate = ({ editor }) => {
    this.onUpdate(this.editor.getJSON());
  };

  setContainerRef = (ref: HTMLElement | null) => {
    if (ref && this.editorContainerRef !== ref) {
      this.editorContainerRef = ref;
    }
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
    this.contentContainerProps = props.contentContainerProps;

    this.onUpdate = props.onUpdate;
    this.onFocus = props.onFocus;
    this.onBlur = props.onBlur;
    this.onSave = props.onSave;
    this.onLeave = props.onLeave;
    this.editorRef = props.editorRef;
  };

  openLinkInfo = () => {
    this.initialLinkValue = this.editor.getAttributes('link').href;

    const currentSelectionRange = this.editor.view.state.selection;
    this.initialLinkTitle = this.editor.state.doc.textBetween(
        currentSelectionRange.from,
        currentSelectionRange.to,
        ''
    );

    if (!this.initialLinkValue) {
      this.openLinkForm();
    } else {
      this.isLinkInfoOpened = true;
    }
  }

  closeLinkInfo = () => {
    this.isLinkInfoOpened = false;
  }

  openLinkForm = () => {
    this.linkValue = this.initialLinkValue;
    this.linkTitle = this.initialLinkTitle;
    this.closeLinkInfo();
    this.isLinkFormOpened = true;
  }

  closeLinkForm = () => {
    this.isLinkFormOpened = false;
    this.openLinkInfo();
  }

  closeLinkInfoAndForm = () => {
    this.isLinkFormOpened = false;
    this.isLinkInfoOpened = false;
  }

  handleLinkFormKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();

    if (event.key === 'Escape') {
      this.closeLinkForm();
    }

    if (event.key === 'Enter') {
      this.saveNewLinkValue();
    }
  }

  saveNewLinkValue = () => {
    const href = this.getValidLink();

    if (this.initialLinkTitle !== this.linkTitle) {
      const currentSelectionRange = this.editor.view.state.selection;

      this.editor.chain().focus().deleteRange(currentSelectionRange).run();
      this.editor.chain().focus().insertContentAt(currentSelectionRange.from, this.linkTitle).run();
      this.editor.chain().setTextSelection({
        from: currentSelectionRange.from,
        to: currentSelectionRange.from + this.linkTitle.length
      }).run();
    }

    this.editor.chain().focus().setLink({ href, target: '_blank' }).run();

    this.closeLinkForm();
    this.openLinkInfo();
  }

  handleUnsetLink = () => {
    this.editor.chain().focus().unsetLink().run();

    this.isLinkFormOpened = false;
    this.isLinkInfoOpened = false;
  }

  updateLinkValue = (event: SyntheticEvent<HTMLInputElement>) => {
    this.linkValue = (event.target as HTMLInputElement).value;
  }

  updateLinkTitle = (event: SyntheticEvent<HTMLInputElement>) => {
    this.linkTitle = (event.target as HTMLInputElement).value;
  }

  getValidLink = () => {
    const href = this.linkValue.trim();

    if (!href) {
      return this.initialLinkValue;
    }

    return (/^(?:http(s)?:\/\/|mailto:)/.test(href)) ? href : `https://${href}`;
  }
}

export const { StoreProvider: EditorStoreProvider, useStore: useEditorStore } =
  getProvider(EditorStore);
