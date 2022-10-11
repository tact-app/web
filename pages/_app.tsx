import { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { RootStoreProvider } from '../stores/RootStore';
import Layout from '../components/Layout';
import { InputWrapperStyles } from '../components/shared/InputWrapper';

const theme = extendTheme({
  components: {
    ...InputWrapperStyles,
    Menu: {
      baseStyle: {
        list: {
          borderWidth: '0',
          overflow: 'hidden',
        }
      }
    },
    Checkbox: {
      baseStyle: {
        control: {
          _indeterminate: {
            bg: 'white',
            borderColor: 'gray.200',
            color: 'gray.200',
          },
        }
      }
    },
    Drawer: {
      variants: {
        aside: {
          dialog: {
            pointerEvents: 'auto'
          },
          dialogContainer: {
            pointerEvents: 'none'
          }
        }
      }
    }
  }
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <RootStoreProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RootStoreProvider>
    </ChakraProvider>
  );
}
