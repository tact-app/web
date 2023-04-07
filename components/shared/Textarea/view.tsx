import {
  Box,
  forwardRef,
  Text,
  Flex,
  useMergeRefs,
  FormControl,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/pro-light-svg-icons";
import React, { useEffect, useRef } from "react";
import { TextareaAutofit } from "../TextareaAutofit";
import { FormError } from "../FormError";
import { TextareaViewProps } from "./types";
import { useTextareaStore } from "./store";
import { observer } from "mobx-react-lite";

export const TextareaView = observer(forwardRef<TextareaViewProps, typeof TextareaAutofit>(
  function Textarea(
    {
      icon = faAlignLeft,
      fontSize = 'sm',
      placeholder,
      ...textareaProps
    },
    ref
  ) {
    const store = useTextareaStore();

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const refs = useMergeRefs(textareaRef, ref);

    useEffect(() => {
      store.textareaRef = textareaRef.current;
    }, [store]);

    return (
      <FormControl isInvalid={Boolean(store.error)}>
        <Box
          display='flex'
          w='100%'
          position='relative'
          borderColor={store.borderColor}
          borderRadius={4}
          borderWidth={1}
          p={1.5}
          pb={5}
          onClick={store.handleFocus}
          cursor='text'
        >
          {placeholder && !store.value && (
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
            maxLength={store.maxLength}
            minHeight='unset'
            maxHeight={250}
            minRows={1}
            resize='none'
            value={store.value}
            fontSize={fontSize}
            variant='unstyled'
            p={0}
            borderRadius={0}
            onFocus={store.handleTextareaFocus}
            onBlur={store.handleTextareaBlur}
            onKeyDown={store.handleKeyDown}
            {...textareaProps}
          />
          {Boolean(store.maxLength) && (
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
              {store.value.length || 0}/{store.maxLength}
            </Text>
          )}
        </Box>
        <FormError inControl>{store.error}</FormError>
      </FormControl>
    );
  }
));
