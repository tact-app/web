import { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { RootStoreProvider } from '../stores/RootStore';
import Layout from '../components/Layout';
import { TaskInputWrapperStyles } from '../components/pages/Inbox/components/TaskInputWrapper';

const variantOutlined = () => ({
  field: {
    bg: 'gray.100',
    _focus: {
      borderColor: 'blue.400',
      boxShadow: '0 0 0 2px var(--chakra-colors-blue-400)',
      bg: 'white',
    }
  }
});

const theme = extendTheme({
  components: {
    ...TaskInputWrapperStyles,
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
