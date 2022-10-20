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

export type BlockNoteEditorProps = {
  onChange?: (content: JSONContent) => void;
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
      slashCommandExtension.configure({
        commands: {
          ...defaultCommands,
          ...metricCommands,
        },
      }),
      trailingNodeExtension,
      MetricExtension,
    ],
  });

  return <EditorContent editor={editor} />;
});
