import { Input, InputProps, Text, TextProps, useOutsideClick } from '@chakra-ui/react';
import React, { KeyboardEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { NavigationHelper } from '../../../helpers/NavigationHelper';
import { NavigationDirections } from '../../../types/navigation';

type Props = {
  value: string;
  disabled?: boolean;
  titleProps?: TextProps;
  inputProps?: InputProps;
  sharedProps?: TextProps & InputProps;
  widthByTitle?: boolean;
  idEnding?: string;
  navDirectionsToResetEditing?: NavigationDirections[];
  onFocus?(): void;
  onBlur?(): void;
  onChange?(value: string): void;
  onSave?(value: string): void;
  onNavigate?(direction: NavigationDirections, event: KeyboardEvent): void;
};

export const EDITABLE_TITLE_ID_SLUG = 'editable-title';

export function EditableTitle({
  value: initialValue,
  disabled,
  titleProps,
  inputProps,
  sharedProps,
  widthByTitle,
  onFocus,
  onBlur,
  onChange,
  onSave,
  onNavigate,
  idEnding,
  navDirectionsToResetEditing,
}: Props) {
  let setCaretTimeout: NodeJS.Timeout;

  const ref = useRef<HTMLInputElement>();

  const [isEditMode, setIsEditMode] = useState(false);
  const [value, setValue] = useState(initialValue);

  const margin = Number(inputProps?.ml || sharedProps?.ml || 0) - 1;

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => () => clearTimeout(setCaretTimeout), []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateEditMode = (isModeEnabled: boolean) => {
    setIsEditMode(isModeEnabled);

    if (value) {
      setCaretTimeout = setTimeout(() => {
        if (ref.current) {
          ref.current.focus();
          ref.current.setSelectionRange(value.length, value.length);
        }
      });
    } else {
      clearTimeout(setCaretTimeout);
    }
  };

  const handleSave = () => {
    updateEditMode(false);

    const validValue = value.trim();
    setValue(validValue);
    onSave?.(validValue);
    onBlur?.();
  };

  useOutsideClick({
    ref,
    enabled: isEditMode,
    handler: handleSave,
  });

  const handleChange = (e: SyntheticEvent) => {
    e.stopPropagation();

    const updatedValue = (e.target as HTMLInputElement).value;

    setValue(updatedValue);
    onChange?.(updatedValue);
  };

  const resetEditMode = () => {
    updateEditMode(false);
    setValue(initialValue);
    onBlur?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    const direction = NavigationHelper.castKeyToDirection(e.key, e.shiftKey);
    const isCaretPositionInEnd = ref.current.selectionStart === value.length;
    const isCaretPositionInStart = ref.current.selectionStart === 0;

    const isTabNavigate = [NavigationDirections.BACK, NavigationDirections.TAB].includes(direction);

    if (direction === NavigationDirections.INVARIANT) {
      resetEditMode();
    } else if (direction === NavigationDirections.ENTER) {
      handleSave();
    }

    if (
      isTabNavigate ||
      ([NavigationDirections.RIGHT, NavigationDirections.DOWN].includes(direction) && isCaretPositionInEnd) ||
      ([NavigationDirections.UP, NavigationDirections.LEFT].includes(direction) && isCaretPositionInStart)
    ) {
      if (navDirectionsToResetEditing?.includes(direction) || isTabNavigate) {
        resetEditMode();
      }

      onNavigate?.(direction, e);
    }
  };

  const handleEditModeToggle = (e: SyntheticEvent) => {
    if (disabled) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    updateEditMode(true);
  };

  const handleInputBlur = () => {
    updateEditMode(false);
    onBlur?.();
  };

  const handleTextKeyDown = (e: KeyboardEvent) => {
    if ([' ', 'Enter'].includes(e.key)) {
      handleEditModeToggle(e);
    }
  };

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
        onFocus={onFocus}
        onBlur={handleInputBlur}
        onClick={(e) => e.stopPropagation()}
        ref={ref}
        ml={margin}
        pl={1}
        width={widthByTitle ? `${value.length * 10}px` : '100%'}
        maxWidth='100%'
        minWidth='80px'
        {...inputProps}
        {...sharedProps}
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
        outline='none'
        id={`${EDITABLE_TITLE_ID_SLUG}${idEnding ? `-${idEnding}` : ''}`}
        onClick={handleEditModeToggle}
        onKeyDown={handleTextKeyDown}
        _focus={{
          bg: 'gray.75',
          mx: margin,
          pl: 1,
          pr: 1,
          borderRadius: 'md',
        }}
        {...titleProps}
        {...sharedProps}
      >
        {value}
      </Text>
    );
}
