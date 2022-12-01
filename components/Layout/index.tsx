import Head from 'next/head';
import { Box, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { MenuBar } from './components/MenuBar';
import { useHotkeysHandler } from '../../helpers/useHotkeysHandler';
import { useRootStore } from '../../stores/RootStore';
import { observer } from 'mobx-react-lite';

const Layout = observer(function Layout({ children }: { children: ReactNode }) {
  const store = useRootStore();

  useHotkeysHandler(store.keymap, store.hotkeysHandlers);

  return (
    <Flex direction='row' h='100vh'>
      <Head>
        <title>Tact</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <MenuBar />
      <Box flex='1' overflow='scroll'>
        {store.isLoading ? null : children}
      </Box>
    </Flex>
  );
});

export default Layout;
