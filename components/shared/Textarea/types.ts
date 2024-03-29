import { TextareaProps as ChakraTextareaProps } from "@chakra-ui/textarea/dist/textarea";
import { NavigationDirections } from "../../../types/navigation";
import { IconDefinition } from "@fortawesome/pro-solid-svg-icons";
import { KeyboardEvent } from 'react';

export type TextareaParamsToExclude = 'onFocus' | 'onBlur' | 'onKeyDown' | 'maxLength' | 'value';

export type TextareaCallbacks = Pick<ChakraTextareaProps, TextareaParamsToExclude> & {
  onNavigate?(direction: NavigationDirections, event: KeyboardEvent): void;
};

export type TextareaStoreProps = TextareaCallbacks & {
  error?: string;
  maxLength?: number;
};

export type TextareaViewProps = Omit<ChakraTextareaProps, TextareaParamsToExclude> & {
  icon?: IconDefinition;
}

export type TextareaProps = TextareaStoreProps & TextareaViewProps;
