import { ChainedCommands, Editor } from '@tiptap/core';

export enum MetricExtensionTypes {
  RING = 'ring',
  TODO = 'todo',
  NUMBER = 'number',
}

export const insertMetric = (
  type: MetricExtensionTypes,
  editor: Editor,
  chain: ChainedCommands
) => {
  const node = editor.schema.nodeFromJSON({
    type: 'metric',
    attrs: {
      value: 0,
      type,
    },
    content: [
      {
        type: 'text',
        text: 'Metric name',
        marks: [
          {
            type: 'bold',
          },
        ],
      },
    ],
  });

  return {
    chain: chain
      .insertContent(node.toJSON())
      .focus(editor.state.selection.anchor + node.textContent.length - 1),
    node,
  };
};
