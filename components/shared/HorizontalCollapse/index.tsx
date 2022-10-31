import { PropsWithChildren, ReactNode } from 'react';
import { chakra, HTMLChakraProps } from '@chakra-ui/react';

export type HorizontalCollapseProps = {
  children: ReactNode;
  isOpen?: boolean;
  initialWidth?: number | string;
  width?: number | string;
};

export const HorizontalCollapse = ({
  isOpen,
  children,
  initialWidth,
  width,
  flex,
  ...rest
}: PropsWithChildren<HorizontalCollapseProps> & HTMLChakraProps<'div'>) => {
  return (
    <chakra.div
      {...rest}
      h='100%'
      transition={width ? 'width 0.2s ease-in-out' : 'flex 0.2s ease-in-out'}
      w={width !== undefined ? (isOpen ? width : initialWidth) : '100%'}
      flex={flex !== undefined ? (isOpen ? flex : 0) : undefined}
    >
      {children}
    </chakra.div>
  );
};
