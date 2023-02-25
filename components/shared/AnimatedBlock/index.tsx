import React, { LegacyRef, useEffect, useRef } from 'react';
import { Box, Container, BoxProps, ContainerProps } from '@chakra-ui/react';

export type AnimatedBlockParams = {
  deps: unknown[];
  condition: boolean;
};

type Props = {
  animateParams: AnimatedBlockParams;
  ref: LegacyRef<HTMLDivElement>;
} & (
  ({ component: typeof Box } & BoxProps) |
  ({ component: typeof Container } & ContainerProps));

export const AnimatedBlock = React.forwardRef<HTMLDivElement, Props>((
  { component: Component, animateParams, ...compProps },
  containerRef
)  => {
  const componentRef = useRef<HTMLDivElement>(null);

  const setRef = (ref: HTMLDivElement) => {
    componentRef.current = ref;

    return containerRef;
  };

  useEffect(() => {
    if (animateParams.condition) {
      componentRef.current.animate(
        [
          { background: 'var(--chakra-colors-gray-50)', offset: 0 },
          { background: 'initial', offset: .75 },
        ],
        {
          duration: 2800,
          easing: 'linear',
        }
      );
    }
  }, animateParams.deps);

  return <Component {...compProps} ref={setRef} />;
});

AnimatedBlock.displayName = 'AnimatedBox';
