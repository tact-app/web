import { observer } from 'mobx-react-lite';
import { EditorProps, EditorStoreProvider } from './store';
import { EditorView } from './view';

export const Editor = observer(function Editor(props: EditorProps) {
  return (
    <EditorStoreProvider {...props}>
      <EditorView />
    </EditorStoreProvider>
  );
});
