import {
  chakra,
  HTMLChakraProps,
  ThemingProps,
  useStyleConfig,
  forwardRef,
} from '@chakra-ui/react';
import { StyleConfig } from '@chakra-ui/theme-tools';

export const InputWrapperStyles: Record<string, StyleConfig> = {
  InputWrapper: {
    baseStyle: ({ theme }) => ({
      ...theme.components.Input.baseStyle.field,
      ...theme.components.Input.variants.filled,
      bg: 'gray.100',
    }),
    defaultProps: {
      size: 'md',
    },
    sizes: {
      sm: ({ theme }) => theme.components.Input.sizes.sm.field,
      md: ({ theme }) => theme.components.Input.sizes.md.field,
      lg: ({ theme }) => theme.components.Input.sizes.lg.field,
    },
    variants: {
      focused: {
        borderColor: 'blue.400',
        boxShadow: '0 0 0 2px var(--chakra-colors-blue-400)',
        bg: 'white',
      },
      primary: ({ theme }) => {
        console.log(theme);
        return {};
      },
    },
  },
};

export interface InputWrapperProps
  extends HTMLChakraProps<'div'>,
    ThemingProps {
  variant?: string;
  size?: string;
}

export const InputWrapper = forwardRef<InputWrapperProps, 'div'>(
  (props, ref) => {
    const { variant, size, ...rest } = props;
    const styles = useStyleConfig('InputWrapper', { variant, size });

    return <chakra.div ref={ref} __css={styles} {...rest} />;
  }
);
