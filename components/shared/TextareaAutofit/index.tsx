import { observer } from 'mobx-react-lite';
import {
  forwardRef,
  Textarea,
  TextareaProps,
  useMergeRefs,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef } from 'react';
import useResizeObserver from 'use-resize-observer';

export const TextareaAutofit = observer(
  forwardRef(function TextareaAutofit(props: TextareaProps, ref) {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const refs = useMergeRefs(internalRef, ref);
    const fitHeight = useCallback(() => {
      if (internalRef.current) {
        internalRef.current.style.height = '0';
        internalRef.current.style.height = `${internalRef.current.scrollHeight}px`;

        if (internalRef.current.scrollHeight >= Number(props.maxHeight)) {
          internalRef.current.style.overflowY = 'auto';
        }
      }
    }, [props.maxHeight, internalRef]);

    useResizeObserver({
      ref: internalRef,
      onResize: fitHeight,
    });

    useEffect(fitHeight, [props.value, fitHeight]);

    return <Textarea {...props} p={0} overflowY='hidden' ref={refs} />;
  })
);
