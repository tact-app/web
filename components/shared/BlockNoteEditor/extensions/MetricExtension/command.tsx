import {
  SlashMenuGroups,
  SlashMenuItem,
} from 'tact-block-note-core/src/extensions/SlashMenu/SlashMenuItem';
import formatKeyboardShortcut from 'tact-block-note-core/src/extensions/helpers/formatKeyboardShortcut';
import { Range } from '@tiptap/core';

export enum MetricExtensionTypes {
  RING = 'ring',
  TODO = 'todo',
  NUMBER = 'number',
}

export const insertMetric =
  (type: MetricExtensionTypes) => (editor, range: Range) => {
    const component = editor.schema.nodeFromJSON({
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

    return editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent(component.toJSON())
      .run();
  };

export const getMetricCommands = ({
  name,
  type,
  shortcut,
}: {
  name: string;
  type: MetricExtensionTypes;
  shortcut;
}) =>
  new SlashMenuItem(
    name,
    'Goals' as SlashMenuGroups,
    insertMetric(type),
    ['metric', type],
    () => <>M</>,
    'Used to display a metric as ' + name,
    formatKeyboardShortcut(shortcut)
  );

export const metricCommands = {
  ['metric_' + MetricExtensionTypes.RING]: getMetricCommands({
    name: 'Percent metric',
    type: MetricExtensionTypes.RING,
    shortcut: 'Mod+R',
  }),
  ['metric_' + MetricExtensionTypes.TODO]: getMetricCommands({
    name: 'Boolean metric',
    type: MetricExtensionTypes.TODO,
    shortcut: 'Mod+T',
  }),
  ['metric_' + MetricExtensionTypes.NUMBER]: getMetricCommands({
    name: 'Target metric',
    type: MetricExtensionTypes.NUMBER,
    shortcut: 'Mod+N',
  }),
};
