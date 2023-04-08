import { Input, Text, TextProps, InputProps, useOutsideClick } from "@chakra-ui/react";
import React, { SyntheticEvent, useRef, useState, KeyboardEvent, useEffect } from "react";
import { NavigationDirections } from "../TasksList/types";

type Props = {
  value: string;
  titleProps?: TextProps;
  inputProps?: InputProps;
  sharedProps?: TextProps & InputProps;
  widthByTitle?: boolean;
  onChange?(value: string): void;
  onSave?(value: string): void;
  onNavigate?(direction: NavigationDirections): void;
};

export function EditableTitle({
  value: initialValue,
  titleProps,
  inputProps,
  sharedProps,
  widthByTitle,
  onChange,
  onSave,
  onNavigate,
}: Props) {
  let setCaretTimeout: NodeJS.Timeout;

  const ref = useRef<HTMLInputElement>();

  const [isEditMode, setIsEditMode] = useState(false);
  const [value, setValue] = useState(initialValue);

  useEffect(() => () => clearTimeout(setCaretTimeout), []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    setIsEditMode(false);
    onSave?.(value);
  };

  useOutsideClick({
    ref,
    enabled: isEditMode,
    handler: handleSave,
  });

  const handleChange = (e: SyntheticEvent) => {
    const updatedValue = (e.target as HTMLInputElement).value;

    setValue(updatedValue);
    onChange?.(updatedValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Escape':
        setIsEditMode(false);
        setValue(initialValue);
        break;
      case 'Enter':
        handleSave();
        break;
      case 'ArrowDown':
        onNavigate?.(NavigationDirections.DOWN);
        break;
      case 'ArrowUp':
        onNavigate?.(NavigationDirections.UP);
        break;
      case 'ArrowLeft':
        onNavigate?.(NavigationDirections.LEFT);
        break;
      case 'ArrowRight':
        onNavigate?.(NavigationDirections.RIGHT);
        break;
      default:
        break;
    }

    clearTimeout(setCaretTimeout);
  };

  const handleEditModeToggle = (e: SyntheticEvent) => {
    e.stopPropagation();

    setIsEditMode(true);

    setCaretTimeout = setTimeout(() => {
      if (ref.current) {
        ref.current.focus();
        ref.current.setSelectionRange(value.length, value.length);
      }
    });
  }

  return isEditMode ? (
      <Input
        size='md'
        type='text'
        variant='unstyled'
        bg='gray.75'
        lineHeight='6'
        fontWeight='semibold'
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        ref={ref}
        {...inputProps}
        {...sharedProps}
        ml={Number(inputProps?.ml || sharedProps?.ml || 0) - 1}
        pl={1}
        width={widthByTitle ? `${value.length * 10}px` : '100%'}
        maxWidth='100%'
        minWidth='80px'
      />
    ) : (
      <Text
        fontSize='md'
        lineHeight='6'
        fontWeight='semibold'
        w='fit-content'
        maxW='100%'
        textOverflow='ellipsis'
        overflow='hidden'
        whiteSpace='nowrap'
        cursor='text'
        onClick={handleEditModeToggle}
        {...titleProps}
        {...sharedProps}
      >
        {value}
      </Text>
    );
}
