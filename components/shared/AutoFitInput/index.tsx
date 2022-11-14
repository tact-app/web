import { chakra, Input, InputProps } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

export const AutoFitInput = (
  props: InputProps & { inputRef?: (el: HTMLInputElement) => void }
) => {
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
      >
        {props.value}
      </chakra.span>
      <Input
        textAlign='center'
        minW={width + 'px'}
        w={width + 'px'}
        ref={(el) => props.inputRef?.(el)}
        {...props}
      />
    </>
  );
};
