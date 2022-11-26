import { chakra, Input, InputProps } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

export const AutoFitInput = ({
  inputRef,
  ...props
}: InputProps & { inputRef?: (el: HTMLInputElement) => void }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const { width } = ref.current.getBoundingClientRect();
      setWidth(width + 2);
    }
  }, [props.value]);

  return (
    <>
      <chakra.span
        contentEditable={false}
        position='absolute'
        visibility='hidden'
        ref={ref}
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
