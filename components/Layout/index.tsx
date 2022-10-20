import Head from 'next/head';
import { Box, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { MenuBar } from './components/MenuBar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Flex direction='row' h='100vh'>
      <Head>
        <title>Tact</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <MenuBar />
      <Box p={4} flex='1' overflow='scroll'>
        {children}
      </Box>
    </Flex>
  );
}
