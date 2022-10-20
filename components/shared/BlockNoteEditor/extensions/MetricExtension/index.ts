import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { MetricExtensionComponent } from './view';
import { insertMetric, MetricExtensionTypes } from './command';

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
      Enter: ({ editor }) => {
        if (editor.isActive('metric')) {
          insertMetric(MetricExtensionTypes.RING)(editor, {
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
    return ReactNodeViewRenderer(MetricExtensionComponent);
  },
});
