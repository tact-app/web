import { observer } from 'mobx-react-lite';
import { EmojiSelectView } from './view';
import { EmojiSelectStoreProvider } from './store';
import { EmojiSelectProps } from './types';
import React, { forwardRef } from 'react';

export const EmojiSelect = observer(forwardRef<HTMLButtonElement, EmojiSelectProps>(
  function EmojiSelect(props, ref) {
    return (
      <EmojiSelectStoreProvider {...props}>
        <EmojiSelectView
          size={props.size}
          iconFontSize={props.iconFontSize}
          borderRadius={props.borderRadius}
          canRemoveEmoji={props.canRemoveEmoji}
          cursor={props.cursor}
          tabIndex={props.tabIndex}
          preventOnFocus={props.preventOnFocus}
          ref={ref}
        />
      </EmojiSelectStoreProvider>
    );
  }
));
