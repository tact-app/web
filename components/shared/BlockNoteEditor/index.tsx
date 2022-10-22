import { observer } from 'mobx-react-lite';
import { JSONContent } from '@tiptap/core';
import {
  EditorContent,
  getBlockNoteExtensions,
  useEditor,
} from 'tact-block-note-core/src';
import { MetricExtension } from './extensions/MetricExtension';
import { defaultCommands } from 'tact-block-note-core/src/extensions/SlashMenu';
import { metricCommands } from './extensions/MetricExtension/command';
import { TaskList } from './extensions/TaskListExtension';
import { TaskItem } from '@tiptap/extension-task-item';
import { externalCommands } from './extensions/externalCommands';

export type BlockNoteEditorProps = {
  onChange?: (content: JSONContent) => void;
  onBlur?: () => void;
  value: JSONContent;
};

export const BlockNoteEditor = observer(function BlockNoteEditor(
  props: BlockNoteEditorProps
) {
  const extensions = getBlockNoteExtensions();
  const mainExtensions = extensions.filter(
    (e) => e.name !== 'slash-command' && e.name !== 'trailingNode'
  );
  const slashCommandExtension = extensions.find(
    (e) => e.name === 'slash-command'
  );
  const trailingNodeExtension = extensions.find(
    (e) => e.name === 'trailingNode'
  );

  const editor = useEditor({
    onUpdate: ({ editor }) => {
      props.onChange?.(editor.getJSON());
    },
    content: props.value,
    enableBlockNoteExtensions: false,
    extensions: [
      ...mainExtensions,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      slashCommandExtension.configure({
        commands: {
          ...defaultCommands,
          ...metricCommands,
          ...externalCommands,
        },
      }),
      trailingNodeExtension,
      MetricExtension,
    ],
  });

  return <EditorContent editor={editor} onBlur={props.onBlur} />;
});
