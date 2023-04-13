import { ReactNode } from "react";

export type FilterOptionItem = {
  label: ReactNode;
  value: string
  icon?: ReactNode;
};

export type FilterProps = {
  options: FilterOptionItem[];
  value: string;
  onChange?(value: string): void;
};
