import { observer } from 'mobx-react-lite';
import { DescriptionEditorBlockProps, DescriptionEditorBlockStoreProvider } from './store';
import { DescriptionEditorBlockView } from './view';
import { useDescriptionEditorStore } from '../../store';

export const DescriptionEditorBlock = observer(function DescriptionEditorBlock(props: { id: string, isFocused: boolean } & DescriptionEditorBlockProps) {
  const store = useDescriptionEditorStore();
  const block = store.blocks[props.id];

  return (
    <DescriptionEditorBlockStoreProvider
      block={block}
      onFocus={store.draggableList.setFocusedItem}
      onUpdate={store.updateBlock}
      onRemove={store.removeBlock}
      onBlockCreate={store.addBlock}
      {...props}
    >
      <DescriptionEditorBlockView/>
    </DescriptionEditorBlockStoreProvider>
  );
});