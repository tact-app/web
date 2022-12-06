import { chakra, Input, InputProps } from '@chakra-ui/react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export const AutoFitInput = ({
  inputRef,
  ...props
}: InputProps & { inputRef?: (el: HTMLInputElement) => void }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [isInited, setIsInited] = useState(false);
  const [width, setWidth] = useState(0);

  const handleRef = useCallback((node) => {
    if (node) {
      ref.current = node;
      setIsInited(true);
    } else {
      setIsInited(false);
    }
  }, []);

  useLayoutEffect(() => {
    if (isInited) {
      setTimeout(() => {
        if (ref.current) {
          const { width } = ref.current.getBoundingClientRect();
          setWidth(width + 2);
        }
      });
    }
  }, [props.value, isInited]);

  return (
    <>
      <chakra.span
        contentEditable={false}
        position='absolute'
        visibility='hidden'
        ref={handleRef}
        fontSize={props.fontSize || 'md'}
        fontWeight={props.fontWeight || 'normal'}
      >
        {props.value}
      </chakra.span>
      <Input
        textAlign='center'
        minW={width + 'px'}
        w={width + 'px'}
        ref={inputRef}
        {...props}
      />
    </>
  );
};
