import { observer } from 'mobx-react-lite';
import {
  DescriptionEditorCreateMenuProps,
  DescriptionEditorCreateMenuStoreProvider,
  DescriptionEditorCreateMenuStore
} from './store';
import { DescriptionEditorCreateMenuView } from './view';
import { PropsWithChildren } from 'react';

export const DescriptionEditorCreateMenu = observer(function DescriptionEditorCreateMenu(props: PropsWithChildren<DescriptionEditorCreateMenuProps> & { instance?: DescriptionEditorCreateMenuStore }) {
  return (
    <DescriptionEditorCreateMenuStoreProvider {...props}>
      <DescriptionEditorCreateMenuView>
        {props.children}
      </DescriptionEditorCreateMenuView>
    </DescriptionEditorCreateMenuStoreProvider>
  );
});