import { observer } from 'mobx-react-lite';
import { EmojiSelectComponent } from './view';
import { EmojiSelectStoreProvider } from './store';
import { EmojiSelectProps } from './types';

export const EmojiSelect = observer(function EmojiSelect(
  props: EmojiSelectProps
) {
  return (
    <EmojiSelectStoreProvider {...props}>
      <EmojiSelectComponent
        size={props.size}
        iconFontSize={props.iconFontSize}
        borderRadius={props.borderRadius}
        canRemoveEmoji={props.canRemoveEmoji}
        cursor={props.cursor}
      />
    </EmojiSelectStoreProvider>
  );
});
