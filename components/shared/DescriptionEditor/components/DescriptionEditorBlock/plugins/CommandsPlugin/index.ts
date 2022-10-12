import { Extension } from '@tiptap/core';
import { Suggestion } from '@tiptap/suggestion';

export const Commands = Extension.create({
  name: 'mention',

  defaultOptions: {
    suggestion: {
      char: '/',
      startOfLine: false,
      command: ({ editor, range, props }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode(props.value, props.config)
          .run();
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion
      })
    ];
  }
});