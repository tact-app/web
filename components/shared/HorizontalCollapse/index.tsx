import { PropsWithChildren, ReactNode } from 'react';
import { chakra, HTMLChakraProps } from '@chakra-ui/react';

export type HorizontalCollapseProps = {
  children: ReactNode;
  isOpen?: boolean;
  initialWidth?: number;
  width?: number;
};

export const HorizontalCollapse = ({
  isOpen,
  children,
  initialWidth = 0,
  width = 100,
  ...rest
}: PropsWithChildren<HorizontalCollapseProps> & HTMLChakraProps<'div'>) => {
  return (
    <chakra.div
      {...rest}
      h='100%'
      transition={[`width 0.2s ease-in-out`]}
      w={isOpen ? width : initialWidth}
    >
      {children}
    </chakra.div>
  );
};
