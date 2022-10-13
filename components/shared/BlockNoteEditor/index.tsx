import { observer } from 'mobx-react-lite';
import { JSONContent } from '@tiptap/core';
import { EditorContent, useEditor } from 'tact-block-note-core/src';

export type BlockNoteEditorProps = {
  onChange?: (content: JSONContent) => void;
  value: JSONContent;
}

export const BlockNoteEditor = observer(function BlockNoteEditor(props: BlockNoteEditorProps) {
  const editor = useEditor({
    onUpdate: ({ editor }) => {
      props.onChange?.(editor.getJSON());
    },
    content: props.value
  });

  return <EditorContent editor={editor}/>;
});
