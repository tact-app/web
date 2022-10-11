import { observer } from 'mobx-react-lite';
import { DescriptionEditorStoreProvider } from './store';
import { DescriptionEditorView } from './view';
import { DraggableListStoreProvider } from '../DraggableList/store';

export const DescriptionEditor = observer(function DescriptionEditor(props) {
  return (
    <DescriptionEditorStoreProvider {...props}>
        <DescriptionEditorView/>
    </DescriptionEditorStoreProvider>
  );
});