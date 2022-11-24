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
      focus: {
        default: false,
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

          const { chain } = insertMetric(
            attrs.type,
            editor,
            editor.chain().focus(),
            false
          );

          chain.run();

          return true;
        } else {
          return false;
        }
      },
      Tab: ({ editor }) => {
        if (editor.isActive('metric')) {
          editor.commands.updateAttributes('metric', { focus: true });

          return true;
        }

        return false;
      },
      Enter: ({ editor }) => {
        if (
          editor.isActive('metric') &&
          !editor.state.selection.$to.nodeAfter
        ) {
          editor.chain().focus().unsetBold().run();
        }

        return false;
      },
      ArrowDown: ({ editor }) => {
        const anchor = editor.state.selection.$anchor;
        const nextNodePos =
          anchor.pos - anchor.parentOffset + anchor.parent.content.size + 1;

        if (
          editor.isActive('metric') &&
          anchor.parent.type.name === 'metric' &&
          !anchor.doc.childAfter(nextNodePos).node
        ) {
          editor.chain().focus().selectTextblockEnd().run();

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
