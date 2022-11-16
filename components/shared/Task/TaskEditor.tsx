import { Editor } from '../Editor';
import React from 'react';
import { useTaskStore } from './store';
import { observer } from 'mobx-react-lite';

export const TaskEditor = observer(function TaskEditor() {
  const store = useTaskStore();

  return (
    <Editor
      content={store.description ? store.description.content : undefined}
      isFocused={store.isEditorFocused}
      onUpdate={store.handleDescriptionChange}
      onBlur={store.handleDescriptionBlur}
    />
  );
});
