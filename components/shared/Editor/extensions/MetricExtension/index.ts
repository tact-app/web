import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { MetricExtensionComponent } from './view';
import { insertMetric, MetricExtensionTypes } from './command';

export const MetricExtension = Node.create({
  name: 'metric',

  group: 'block',
  content: 'inline*',

  addAttributes() {
    return {
      value: {
        default: 0,
      },
      targetValue: {
        default: 100,
      },
      type: {
        default: MetricExtensionTypes.RING,
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
      'Shift-Enter': ({ editor }) => {
        if (editor.isActive('metric')) {
          const attrs = editor.getAttributes('metric');

          const { chain, node } = insertMetric(
            attrs.type,
            editor,
            editor.chain().focus()
          );

          chain.run();

          return true;
        } else {
          return false;
        }
      },
      Enter: ({ editor }) => {
        if (editor.isActive('metric')) {
          editor
            .chain()
            .focus()
            .insertContent(
              editor.schema.nodes['paragraph'].createAndFill().toJSON()
            )
            .focus(editor.state.selection.anchor + 1)
            .run();
          return true;
        }

        return false;
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['react-component', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MetricExtensionComponent);
  },
});
