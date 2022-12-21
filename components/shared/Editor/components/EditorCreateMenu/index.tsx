import { observer } from 'mobx-react-lite';
import {
  EditorCreateMenuProps,
  EditorCreateMenuStoreProvider,
  EditorCreateMenuStore,
} from './store';
import { EditorCreateMenuView } from './view';
import { PropsWithChildren } from 'react';

export const EditorCreateMenu = observer(function EditorCreateMenu(
  props: PropsWithChildren<EditorCreateMenuProps> & {
    instance?: EditorCreateMenuStore;
  }
) {
  return (
    <EditorCreateMenuStoreProvider {...props}>
      <EditorCreateMenuView>{props.children}</EditorCreateMenuView>
    </EditorCreateMenuStoreProvider>
  );
});
