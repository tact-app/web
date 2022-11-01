import { PropsWithChildren, ReactNode } from 'react';
import { chakra, HTMLChakraProps } from '@chakra-ui/react';

export type HorizontalCollapseProps = {
  children: ReactNode;
  isOpen?: boolean;
  initialWidth?: number | string;
  width?: number | string;
  resizable?: boolean;
};

export const HorizontalCollapse = ({
  isOpen,
  children,
  initialWidth,
  width,
  resizable,
  ...rest
}: PropsWithChildren<HorizontalCollapseProps> & HTMLChakraProps<'div'>) => {
  return (
    <chakra.div
      {...rest}
      h='100%'
      transition='width 0.2s ease-in-out'
      w={isOpen ? width : initialWidth}
    >
      {children}
    </chakra.div>
  );
};
