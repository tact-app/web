import { Editor } from '../Editor';
import React from 'react';
import { useTaskStore } from './store';
import { observer } from 'mobx-react-lite';

export const TaskEditor = observer(function TaskEditor() {
  const store = useTaskStore();

  return (
    <Editor
      content={store.descriptionId ? store.descriptionContent.get() : undefined}
      editorRef={store.setEditor}
      onUpdate={store.handleDescriptionChange}
      onLeave={() => store.quickEditor.setFocus(true)}
      onFocus={store.handleDescriptionFocus}
      onBlur={store.handleDescriptionBlur}
      contentContainerProps={{ pl: 6, pr: 6 }}
    />
  );
});
