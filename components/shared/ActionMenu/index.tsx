import { observer } from 'mobx-react-lite';
import { ActionMenuProps } from "./types";
import { ActionMenuStoreProvider } from './store';
import { ActionMenuView } from "./view";

export const ActionMenu = observer(function ActionMenu(props: ActionMenuProps) {
  return (
    <ActionMenuStoreProvider {...props}>
      <ActionMenuView
        triggerIcon={props.triggerIcon}
        hidden={props.hidden}
        menuMinWidth={props.menuMinWidth}
        triggerButtonProps={props.triggerButtonProps}
        triggerIconFontSize={props.triggerIconFontSize}
        customTrigger={props.customTrigger}
      />
    </ActionMenuStoreProvider>
  );
});
