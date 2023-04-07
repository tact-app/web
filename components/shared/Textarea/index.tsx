import { observer } from "mobx-react-lite";
import React from "react";
import { forwardRef } from "@chakra-ui/react";
import { TextareaProps } from "./types";
import { TextareaView } from "./view";
import { TextareaStoreProvider } from './store';

export const Textarea = observer(forwardRef<TextareaProps, typeof TextareaView>(
  function Textarea(
    {
      maxLength,
      value,
      onFocus,
      onBlur,
      onKeyDown,
      onNavigate,
      error,
      ...viewProps
    },
    ref
  ) {
    return (
      <TextareaStoreProvider
        maxLength={maxLength}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onNavigate={onNavigate}
        error={error}
      >
        <TextareaView {...viewProps} ref={ref} />
      </TextareaStoreProvider>
    );
  }
));
