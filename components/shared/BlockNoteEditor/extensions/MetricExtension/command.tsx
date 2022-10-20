import {
  SlashMenuGroups,
  SlashMenuItem,
} from 'tact-block-note-core/src/extensions/SlashMenu/SlashMenuItem';
import formatKeyboardShortcut from 'tact-block-note-core/src/extensions/helpers/formatKeyboardShortcut';
import { Range } from '@tiptap/core';

export const insertMetric = (editor, range: Range) => {
  const component = editor.schema.nodeFromJSON({
    type: 'metric',
    attrs: {
      value: 0,
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

  return editor
    .chain()
    .focus()
    .deleteRange(range)
    .insertContent(component.toJSON())
    .run();
};

export const metricCommands = {
  metric: new SlashMenuItem(
    'Metric',
    'Goals' as SlashMenuGroups,
    insertMetric,
    ['metric'],
    () => <>M</>,
    'Used to display a metric',
    formatKeyboardShortcut('Mod-m')
  ),
};
