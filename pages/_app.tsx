import { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { RootStoreProvider } from '../stores/RootStore';
import Layout from '../components/Layout';
import { TaskInputWrapperStyles } from '../components/pages/Inbox/components/TaskInputWrapper';

const theme = extendTheme({
  components: {
    ...TaskInputWrapperStyles,
    Menu: {
      baseStyle: {
        list: {
          borderWidth: '0',
          overflow: 'hidden',
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
