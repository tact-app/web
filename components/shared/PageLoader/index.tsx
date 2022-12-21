import { Box, Center, Spinner } from '@chakra-ui/react';

export const PageLoader = () => (
  <Box h='100%' w='100%'>
    <Center>
      <Spinner />
    </Center>
  </Box>
);
