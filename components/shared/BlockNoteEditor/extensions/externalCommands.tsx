import {
  SlashMenuGroups,
  SlashMenuItem,
} from 'tact-block-note-core/src/extensions/SlashMenu/SlashMenuItem';
import formatKeyboardShortcut from 'tact-block-note-core/src/extensions/helpers/formatKeyboardShortcut';
import { Range } from '@tiptap/core';

export const insertTaskList = (editor, range: Range) => {
  const component = editor.schema.nodeFromJSON({
    type: 'taskList',
    content: [
      {
        type: 'taskItem',
        attrs: {
          checked: false,
        },
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: ' ',
              },
            ],
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

export const externalCommands = {
  taskList: new SlashMenuItem(
    'Task List',
    SlashMenuGroups.BASIC_BLOCKS,
    insertTaskList,
    ['list', 'task', 'todo', 'check', 'checkbox'],
    () => <>T</>,
    'Used to display a task list',
    formatKeyboardShortcut('Mod-Shift-9')
  ),
};
