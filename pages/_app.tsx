import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { RootStoreProvider } from '../stores/RootStore';
import Layout from '../components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <RootStoreProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RootStoreProvider>
    </ChakraProvider>
  );
}
