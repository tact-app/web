import { ChainedCommands, Editor, Extension, Range } from '@tiptap/core';
import { Suggestion } from '@tiptap/suggestion';

export const Commands = Extension.create({
  name: 'mention',

  defaultOptions: {
    suggestion: {
      char: '/',
      startOfLine: false,
      command: ({
        editor,
        range,
        props,
      }: {
        editor: Editor;
        range: Range;
        props: {
          command: (chain: ChainedCommands, editor: Editor) => ChainedCommands;
        };
      }) => {
        props.command(editor.chain().focus().deleteRange(range), editor).run();
      },
    },
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
