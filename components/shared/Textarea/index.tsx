import {
  Box,
  forwardRef,
  Text,
  Flex,
  TextareaProps as ChakraTextareaProps, useMergeRefs,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/pro-light-svg-icons";
import React, { useRef, useState, FocusEvent } from "react";
import { IconDefinition } from "@fortawesome/pro-solid-svg-icons";
import { TextareaAutofit } from "../TextareaAutofit";

type Props = ChakraTextareaProps & {
  icon?: IconDefinition;
}

export const Textarea = forwardRef<Props, typeof TextareaAutofit>(function Textarea(
  {
    icon = faAlignLeft,
    fontSize = 'sm',
    maxLength,
    value,
    placeholder,
    onFocus,
    onBlur,
    ...textareaProps
  },
  ref
) {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const refs = useMergeRefs(textareaRef, ref);

  const handleFocus = () => {
    textareaRef.current?.focus();
  };
  const handleTextareaFocus = (e: FocusEvent<HTMLTextAreaElement, Element>) => {
    onFocus?.(e);
    setIsFocused(true);
  };
  const handleTextareaBlur = (e: FocusEvent<HTMLTextAreaElement, Element>) => {
    onBlur?.(e);
    setIsFocused(false);
  };

  return (
    <Box
      ref={containerRef}
      display='flex'
      w='100%'
      position='relative'
      borderColor={isFocused ? 'blue.400' : 'gray.200'}
      borderRadius={4}
      borderWidth={1}
      p={1.5}
      pb={5}
      onClick={handleFocus}
      cursor='text'
    >
      {placeholder && !value && (
        <Flex
          color='gray.400'
          alignItems='center'
          position='absolute'
          top={1}
          left={1.5}
        >
          <FontAwesomeIcon icon={icon} fontSize={13} />
          <Text fontSize={fontSize} ml={1.5}>{placeholder}</Text>
        </Flex>
      )}
      <TextareaAutofit
        ref={refs}
        maxLength={maxLength}
        minHeight='unset'
        maxHeight={250}
        minRows={1}
        resize='none'
        value={value}
        fontSize={fontSize}
        variant='unstyled'
        p={0}
        borderRadius={0}
        onFocus={handleTextareaFocus}
        onBlur={handleTextareaBlur}
        {...textareaProps}
      />
      {Boolean(maxLength) && (
        <Text
          fontSize='xs'
          fontWeight='normal'
          alignSelf='end'
          lineHeight={4}
          color='gray.400'
          position='absolute'
          bottom={2}
          right={2}
        >
          {String(value).length || 0}/{maxLength}
        </Text>
      )}
    </Box>
  )
});
