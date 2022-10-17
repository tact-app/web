import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { MetricExtensionView } from './view';
import { insertMetric } from './command';


export const MetricExtension = Node.create({
  name: 'metric',

  group: 'inline',
  inline: true,
  content: 'inline*',

  addAttributes() {
    return {
      value: {
        default: 0,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'react-component',
      },
    ];
  },

  addKeyboardShortcuts() {
    return {
      'Enter': ({ editor }) => {
        if (editor.isActive('metric')) {
          editor.chain().focus().addNewBlockAsSibling().run();

          insertMetric(editor, {
            from: editor.state.selection.from,
            to: editor.state.selection.to,
          });

          return true;
        } else {
          return false;
        }
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['react-component', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MetricExtensionView);
  },
});
