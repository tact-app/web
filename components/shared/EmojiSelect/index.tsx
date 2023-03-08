import { observer } from 'mobx-react-lite';
import { EmojiSelectComponent } from './view';
import { EmojiSelectProps, EmojiSelectStoreProvider } from './store';

export const EmojiSelect = observer(function EmojiSelect(
  props: EmojiSelectProps
) {
  return (
    <EmojiSelectStoreProvider {...props}>
      <EmojiSelectComponent size={props.size} iconFontSize={props.iconFontSize} />
    </EmojiSelectStoreProvider>
  );
});
