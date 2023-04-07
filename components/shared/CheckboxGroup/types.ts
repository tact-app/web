import { ReactNode } from "react";
import { ListNavigation } from "../../../helpers/ListNavigation";

export type CheckboxGroupItem = {
  value: string;
  label: ReactNode;
};

export type CheckboxGroupCallbacks = {
  onChange(value: CheckboxGroupItem['value']): void;
};

export type CheckboxGroupProps = CheckboxGroupCallbacks & {
  items: CheckboxGroupItem[];
  value?: CheckboxGroupItem['value'];
  error?: string;
  customListNavigation?: ListNavigation;
};
