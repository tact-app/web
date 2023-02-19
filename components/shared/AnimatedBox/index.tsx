import React, { LegacyRef, useEffect, useRef } from 'react';
import { Box, Container, BoxProps, ContainerProps } from '@chakra-ui/react';

type Props = {
  animateDeps: unknown[];
  animateCondition: boolean;
  ref: LegacyRef<HTMLDivElement>;
} & (
  ({ component: typeof Box } & BoxProps) |
  ({ component: typeof Container } & ContainerProps));

export const AnimatedBox = React.forwardRef<HTMLDivElement, Props>((
  { component: Component, animateDeps, animateCondition, ...compProps },
  ref
)  => {
  const ref1 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animateCondition) {
      ref1.current.animate(
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
  }, animateDeps);

  return (
    <Component
      {...compProps}
      ref={(ref2) => {
        ref1.current = ref2;
        return ref;
      }}
    />
  );
});

AnimatedBox.displayName = 'AnimatedBox';
