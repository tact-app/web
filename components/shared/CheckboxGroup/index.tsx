import React from "react";
import { observer } from "mobx-react-lite";
import { CheckboxGroupStoreProvider } from "./store";
import { CheckboxGroupView } from "./view";
import { CheckboxGroupProps } from './types';

export const CheckboxGroup = observer(function CheckboxGroup(
  props: CheckboxGroupProps
) {
  return (
    <CheckboxGroupStoreProvider {...props}>
      <CheckboxGroupView />
    </CheckboxGroupStoreProvider>
  );
});
